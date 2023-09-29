import React, { useState, useEffect, useRef } from "react";
import { Modal, Form, FormFeedback, Input } from "reactstrap"
import rederror from "../../assets/images/redvalidationicon/rederror.jpg"
import { Dropdown } from "semantic-ui-react"
import { getCountryList, getGstCountries, postCountry, completeProfile, updateProfileSilent, storeUserData } from "../../pages/Authentication/store/apiServices";
import { getCurrencyList } from "../../pages/Service/store/apiService";
import { useFormik } from "formik";
import { customRegex } from "../../helpers/validation_helpers";
import * as Yup from "yup"
import { toast } from "react-toastify";
import { loginData} from "../../pages/Authentication/store/apiServices";
import { useDispatch } from "react-redux";
import { isCurrencyAddedModal } from "../../store/widgets/action";
import { isCurrencyAddedProduct } from "../../store/products/action";
// import intlTelInput from 'intl-tel-input';
// import 'intl-tel-input/build/css/intlTelInput.css';
const BillingAddressModal = ({openModal, setOpenModal, setLoading} = props) => {
	const dispatch = useDispatch()
	const phoneInputRef = useRef(null);
	const continueRef = useRef(null)
	const [activeTab, setActiveTab] = useState("step-1")
	const [countryList, setcountryList] = useState()
	const [gstCountries, setGstCountries] = useState()
	const [gstCountry, setGstCountry] = useState(false)
	const [addressType, setAddressType] = useState("Automatically")
	const [selectedAddress, setSelectedAddress] = useState()
	const [step2Disabled, setStep2Disabled] = useState(true)
	const [spinner, setSpinner] = useState({step1: false, step2: false})
	const [currencyList, setCurrencyList] = useState();
	const [finalAddress, setFinalAddress] = useState();
	const [accountInfo, setAccountInfo] = useState();
	const [gstEnabled, setGstEnabled] = useState()
	const [selectedPhoneCode, setSelectedPhoneCode] = useState()
	const [selectedCountryCode, setSelectedCountryCode] = useState()
	const [billingFormVal, setBillingFormVal] = useState()

	useEffect(() => {
		getcountry()
		getGstCountriesList()
		fetchCurrencyList()
		let info = loginData()
		info?.gst_enabled === 1? setGstEnabled(true) : setGstEnabled(false)
		setAccountInfo(info)
  	},[])

	useEffect(() => {
		if(countryList && gstCountries){
			accountInfo?.country_id? checkGST(accountInfo?.country_id) : null
		}
	}, [accountInfo, countryList, gstCountries])

	const getcountry = async () => {
		try {
			let res = await getCountryList()
			let all = []
			res.data.data.map(ele => {
				all.push({
					value: ele.name,
					flag: (
						<img value={ele.id} height={15} width={15} src={ele.country_flag} />
					),
					text: ele.name,
					value: ele.id,
					short_code: ele.short_code
				})
			})
			setcountryList(all)
		} catch (error) {

		}
	}

	const getStateList = async (countryId) => {
		try {
			let data = new URLSearchParams({
			country_id: countryId,
			})
			let res = await postCountry(data)
			let all = []
			if (res) {

			res.data.data.map(ele => {
				all.push({ text: ele.name, value: ele.id })
			})
			return all
			}
		} catch (error) { }
	}

	const fetchCurrencyList = async () =>{
		try {
			let res = await getCurrencyList();
			let currency_list = res?.data?.data;
			if (currency_list) {
			  setCurrencyList(currency_list);
			}
		  } catch (error) {}
	}

	const getGstCountriesList = async () => {
		try {
			let res = await getGstCountries()
			setGstCountries(res?.data?.data)
		} catch (error) {

		}
	}

	window.initMap = () => {
		let autocomplete = new window.google.maps.places.Autocomplete(
			document.getElementById('pickup_location')
		);
		autocomplete.addListener('place_changed', () => {
			const selectedPlace = autocomplete.getPlace();
			setSelectedAddress(selectedPlace)
		});
	};

	useEffect(() => {
		// Ensure that Google Maps API script is loaded before calling initMap
		if(activeTab === "step-1" && addressType == "Automatically"){
			const interval = setInterval(() => {
				if (typeof window.google === 'object' && typeof window.google.maps === 'object') {
					window.initMap(); // Initialize the autocomplete
				} 
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [activeTab, addressType]);

	useEffect(() => {
		if(selectedAddress){
			//set auto address field value
			if(addressType === "Automatically"){
				if(selectedAddress?.formatted_address){
					if(selectedAddress?.formatted_address?.includes(selectedAddress?.name)){
						billingInfoForm.setFieldValue('addressAuto',selectedAddress?.formatted_address)
					}else{
						billingInfoForm.setFieldValue('addressAuto',`${selectedAddress?.name}, ${selectedAddress?.formatted_address}`)
					}
				}
			}
			let name = selectedAddress?.name;
			let postalCode = "";
			let city = "";
			let state = "";
			let countryShort = "";
			let countryLong = "";

			//fetching name's of city, state, country and postal code.
			if(selectedAddress?.formatted_address){
				selectedAddress?.address_components?.forEach((component) => {
					if (component?.types?.includes("postal_code")) {
						postalCode = component?.short_name;
					} else if (component?.types?.includes("locality")) {
						city = component?.long_name;
					} else if (component?.types?.includes("country")) {
						countryShort = component?.short_name;
						countryLong = component?.long_name;
					} else if (component?.types?.includes("administrative_area_level_1")) {
						state = component?.long_name
					}
				});

				gstCountries.includes(countryShort) ? setGstCountry(true) : setGstCountry(false)
				let formattedAddress =selectedAddress?.formatted_address
				//step one remove values from formatted address.
				let address = ""
				address = formattedAddress?.replace(`${name}`, '').trim()
				address = address?.replace(`${city}`, '').trim()
				address = address?.replace(`${state}`, '').trim()
				address = address?.replace(`${countryLong}`, '').trim()
				address = address?.replace(`${postalCode}`, '').trim()

				//step 2 remove spaces and , from address. so we can identify if address contain only space and only ,. 
				const removeSpace = new RegExp(` `, 'g')
				const pattern = new RegExp(`,`, 'g')
				let address1 = address?.replace(removeSpace, '').trim();
				address1 = address1?.replace(pattern, '').trim();

				// step 3 if after removing space and , address length still greater then 0 we formate the final address.
				 let finalAddress = ""
				 if(address1.length > 0){
					 if(name != city){
						if(!address?.includes(name)){
							finalAddress = name + ", " + address
						}else{
							finalAddress = address
						}
					 }else{
						finalAddress = address
					 }
				 }

				 //step 4 remove extra space + ,.
				 const pattern2 = new RegExp(` ,`, 'g')
				 finalAddress = finalAddress.replace(pattern2, '').trim();
				 setFinalAddress(finalAddress)
				// const removeName = selectedAddress?.formatted_address.replace(`${selectedAddress?.name}`, '').trim()
				// const removeCity = removeName.replace(`${city}`, '').trim()
				// const removeState = removeName.replace(`${state}`, '').trim()
				// const removeCountry = removeName.replace(`${countryLong}`, '').trim()
				// const removeZipCode = removeName.replace(`${postalCode}`, '').trim()


				// Create a regular expression pattern to match these values
				// const pattern1 = new RegExp(`${postalCode}|${city}|${state}|${countryLong}`, 'g');
				// Create a regular expression pattern to match extra spaces and colun
				// const pattern2 = new RegExp(` ,`, 'g')
				// Remove the matched values from the formatted address
				// const cleanedAddress1 = selectedAddress?.formatted_address.replace(pattern1, 'g').trim();
				// const cleanedAddress2 = cleanedAddress1?.replace(pattern2, '').trim();

				// let finalAddress = ""
				// if(!selectedAddress?.formatted_address?.includes(selectedAddress?.name)){
				// 	finalAddress = `${selectedAddress?.name} ${cleanedAddress2}`
				// }else (
				// 	finalAddress = cleanedAddress2
				// )
				// setFinalAddress(finalAddress)
				
				// fetching country id and state id
				countryList.map(async(countries) => {
					if (countryShort === countries?.short_code){
						billingInfoForm.setFieldValue('country',countries.value)
						let stateList = await getStateList(countries.value)
						stateList.map((states)=>{
							if(state == states.text){
								billingInfoForm.setFieldValue('state',states.value)
							}
						})
					}
				})
				billingInfoForm.setFieldValue('zipCode',postalCode)
				billingInfoForm.setFieldValue('city',city)
			}
	}

	}, [selectedAddress])

	const billingInfoForm = useFormik(({
		enableReinitialize: true,

		initialValues: {
			companyName: "",
			phoneNumber: "",
			addressAuto: "",
			addressManual: "",
			city: "",
			state: "", //this key is only used to store state id
			zipCode: "",
			country: accountInfo?.country_id || "",
			addressType: addressType,
		},

		validationSchema: (addressType) => {
			let schema = Yup.object().shape({
				companyName: Yup.string()
					.matches(customRegex.address, "Please enter valid a company name.")
					.min(3, "The company name must be at least 3 characters long.")
					.max(20, "The company name can't be longer than 30 characters."),
				phoneNumber: Yup.string()
					.required("Please enter your phone number.")
					.matches(customRegex.phoneNumber, "Please enter a valid phone number."),
				addressAuto: Yup.string().when('addressType', {
					is: 'Automatically', // Use 'Automatically' to match addressType
					then: Yup.string()
						.required("Please enter your address.")
						.matches(customRegex.address, "Please enter a valid address.")
						.matches(customRegex.spaces, "Please enter a valid address.")
						.min(2, "The address must be at least 3 characters long.")
        				// .max(30, "address must be maximum 30 characters long"),
				}),
				addressManual: Yup.string().when('addressType', {
					is: 'Manually', // Use 'Manually' to match addressType
					then: Yup.string()
						.required("Please enter your address.")
						.matches(customRegex.address, "Please enter a valid address.")
						.matches(customRegex.spaces, "Please enter a valid address.")
						.min(2, "The address must be at least 3 characters long.")
						.max(30, "The address can't be longer than 30 characters."),
				}),
				city: Yup.string().when('addressType', {
					is: 'Manually',
					then: Yup.string()
						.required("Please enter the name of your city.")
						.matches(customRegex.address, "Please enter a valid city name.")
						.min(3, "The city name must be at least 3 characters long.")
						.max(30, "The city name can't be longer than 30 characters."),
				}),
				state: Yup.string(),
				zipCode: Yup.string().when('addressType', {
					is: 'Manually',
					then: Yup.string()
						.required("Please enter your zip code.")
						.matches(customRegex.onlyDigitsRegex, "Please enter only digits for the zip code.")
						.min(1, "The zip code must be at least 3 characters long.")
						.max(10, "The zip code can't be longer than 30 characters."),
				}),
				country: Yup.string().when('addressType', {
					is: 'Manually',
					then: Yup.string()
						.required("Please enter your country.")
						.min(3, "The country must be at least 3 characters long.")
						.max(30, "The country can't be longer than 30 characters."),
				})
			})
			return schema
		},
		onSubmit: (values) => {
			setSpinner({...spinner, step1:true})
			setLoading(true)
			setStep2Disabled(false)
			setActiveTab('step-2')
		}
	}))

	const handleDropdownChange = (_, { value }) => {
		countryList?.map((country) => {
			if (value === country?.value)
				setSelectedCountryCode(country?.short_code.toLowerCase())
				gstCountries.includes(country?.short_code) ? setGstCountry(true) : setGstCountry(false)
		})
		billingInfoForm.setFieldValue('country', value);
	};

	const checkGST = (value) => {
		countryList?.map((country) => {
			if (value === country?.value){
				gstCountries?.includes(country?.short_code) ? setGstCountry(true) : setGstCountry(false)
			}
		})
	};

	const currencyInfoForm = useFormik(({
		enableReinitialize: true,
		initialValues: {
			currency: "",
			termConditions: true,
		},
		validationSchema: (values) => {
			let schema = Yup.object().shape({
				currency: Yup.string().required("Please select a currency."),
				termConditions: Yup.bool().oneOf(
					[true],
					"You must accept the terms and conditions."
				  ),
			})
			return schema
		},
		onSubmit: async(values) => {
			setSpinner({...spinner, step2:true})
			setLoading(true)
			let address1 = "";
			let address2 = "";
			let billingInfo = billingInfoForm?.values
			if(addressType === "Automatically"){
				let address = finalAddress?.split(",")
				if(address?.length > 2){
					address1 = address?.splice(0,1);
					address2 = address?.splice(0,address?.length -1);
				}else{
					address1 = finalAddress
				}
			}else{
				address1 = billingInfo?.addressManual
			}
		
			// let address = finalAddress.split(",")
			// // let address1 = "";
			// // let address2 = "";
			// if(address.length > 2){
			// 	 address1 = address.splice(0,1);
			// 	 address2 = address.splice(0,address.length -1);
			// }else{
			// 	 address1 = finalAddress
			// }
			// // return
			// // localStorage.setItem(CONFIGURATIONS.BILLING_MODAL, JSON.stringify(CONFIGURATIONS.BILLINGMODAL_FALSE))
			// // setOpenBillingModal(false)

			let data = new URLSearchParams({
				company_name: billingInfo?.companyName,
				address_one: address1?.toString(),
				address_two: address2?.toString(),
				phone_number: billingInfo?.phoneNumber,
				city: billingInfo?.city,
				country_id: billingInfo?.country,
				state_id: billingInfo?.state,
				zip_code: billingInfo?.zipCode,
				currencyId: values?.currency,
				gst_enabled: gstEnabled? 1 : 0,
				is_agree: values?.termConditions? 1 : 0, 
			})
			
			try{
				let res = await completeProfile(data)
				let info = res?.data?.data
				if(res){
					setOpenModal(false)
					setLoading(false)
					setSpinner({...spinner, step2:false})
					toast.success(res?.data?.message, {
						position: toast.POSITION.TOP_RIGHT,
					})
					let data = loginData()
					data.currency = info?.currency
					data.profile_completed = 1
					storeUserData(data)
					dispatch(isCurrencyAddedModal(info?.currency))
					dispatch(isCurrencyAddedProduct(info?.currency))
					updateProfileSilent()
				}
			}catch(error){
				toast.error(error?.response?.message, {
					position: toast.POSITION.TOP_RIGHT,
				})
				setSpinner({...spinner, step2:false})
				setOpenModal(true)
				setLoading(false)
			}
		}
	}))

	useEffect(() => {
		if(spinner.step1 === true){
			setTimeout(() => {
				setSpinner({...spinner, step1:false})
				setLoading(false)
				setStep2Disabled(false)
				setActiveTab('step-2')
			},500)
		}
	},[spinner.step1])
	
	useEffect(() => {
	const inputElement = phoneInputRef.current;
	if (inputElement) {
		const iti = intlTelInput(inputElement, {
		separateDialCode: true,
		initialCountry: selectedCountryCode,
		utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js"
		
		});
	
		inputElement.addEventListener("countrychange", function () {
		const selectedCountryData = iti.getSelectedCountryData();
		setSelectedPhoneCode(selectedCountryData)
		});
		
		// Clean up by destroying the intlTelInput instance when the component unmounts
		return () => {
		iti.destroy();
		};
	}
	}, [phoneInputRef?.current, selectedCountryCode, activeTab]);

	useEffect(() => {
		countryList?.map((country) => {
			if(billingInfoForm?.values?.country === country.value){
				setSelectedCountryCode(country?.short_code?.toLowerCase())
			}
		})
	},[
		selectedPhoneCode, 
		selectedCountryCode, 
		countryList,
		billingInfoForm?.values?.country
	])

	// useEffect(() => {
	// 	setBillingFormVal(billingInfoForm.values)
	// },[billingInfoForm.values])

	// useEffect(() => {

	// },[])
	return (
		<Modal className="small-model" isOpen={openModal} centered={true}>
			<div className="modal-dialog" role="document">
				<div className="modal-content ">
					<div className="modal-body user-info">
						<div className="stepwizard">
							<h3 className="user-info">Update User Information</h3>
							<div className={activeTab === "step-2" ? "stepwizard-row setup-panel active" : "stepwizard-row setup-panel"}>
								<div className="stepwizard-step">
									<button
										type="button"
										className={activeTab === "step-1" ? "btn btn-primary btn-circle" : "btn btn-default btn-circle"}
										onClick={() => setActiveTab("step-1")}
									>1</button>
									<p onClick={() => setActiveTab("step-1")}>Billing Information</p>
								</div>
								<div className="stepwizard-step stepwizard-step-next-tab">
									<button
										type="button"
										className={activeTab === "step-2" ? "btn btn-primary btn-circle" : "btn btn-default btn-circle"}
										// disabled={step2Disabled}
										onClick={(e) => { 
											continueRef.current.click()
											// step2Disabled ? (
											// 	e.preventDefault(), 
											// 	toast.error("Please fill your billing address first.", { position: toast.POSITION.TOP_RIGHT, })
											// 	) : setActiveTab("step-2") 
											}}
									>2</button>
									<p 
										onClick={(e) => { 
											continueRef.current.click()
											// step2Disabled ? (
											// 	e.preventDefault(), 
											// 	toast.error("Please fill your billing Information first.", { position: toast.POSITION.TOP_RIGHT, })
											// 	) : setActiveTab("step-2") 
										}}
									>Currency Information</p>
								</div>
							</div>
						</div>
						{/* <form role="form" action="" method="post"> */}
						{activeTab === "step-1" &&
							<Form onSubmit={(e) => {
								e.preventDefault()
								billingInfoForm.handleSubmit()
								return false
							}}>
								<div className="row form-row setup-content" id="step-1">
									<div className="form-group">
										<Input
											type="text"
											className="form-control"
											placeholder="Company Name (Optional)"
											name="companyName"
											onChange={billingInfoForm.handleChange}
											onBlur={billingInfoForm.handleBlur}
											value={billingInfoForm.values.companyName || ""}
											invalid={
												billingInfoForm.touched.companyName &&
													billingInfoForm.errors.companyName
													? true
													: false
											}
										/>
										{billingInfoForm.touched.companyName &&
											billingInfoForm.errors.companyName ? (
											<>
												<FormFeedback type="invalid" className="info-modal">
													<img
														className="form-error-icon"
														src={rederror}
														alt=""
														height={15}
													/>
													{billingInfoForm.errors.companyName}
												</FormFeedback>
											</>
										) : null}
									</div>
									<div className="form-group">
										<Input
											type="tel"
											id="phone"
											name="phoneNumber"
											className="form-control"
											placeholder="Phone Number"
											innerRef={phoneInputRef}
											onChange={(e) => {
												const inputValue = e.target.value;
												if (inputValue.startsWith(`+${selectedPhoneCode?.dialCode}`)) {
												   // Remove the dial code from the input value
													const phoneNumberWithoutDialCode = inputValue.substring(`+${selectedPhoneCode?.dialCode}`.length);
													// Update the form field value using formik's handleChange
													billingInfoForm.handleChange({
														target: {
															name: "phoneNumber",
															value: phoneNumberWithoutDialCode,
														},
													});
												// }
												} else {
													// Handle other changes (e.g., non-dial code input)
													billingInfoForm.handleChange(e);
												}
											}}
											onBlur={billingInfoForm.handleBlur}
											value={billingInfoForm.values.phoneNumber || ""}
											invalid={
												billingInfoForm.touched.phoneNumber &&
													billingInfoForm.errors.phoneNumber
													? true
													: false
											}
										/>
										{billingInfoForm.touched.phoneNumber &&
											billingInfoForm.errors.phoneNumber ? (
											<>
												<FormFeedback type="invalid" className="info-modal">
													<img
														className="form-error-icon"
														src={rederror}
														alt=""
														height={15}
													/>
													{billingInfoForm.errors.phoneNumber}
												</FormFeedback>
											</>
										) : null}
										<div id="flag-container"></div>
									</div>
									<div className="form-group manual_address_field">
										{addressType === "Automatically" ?
											<>
											<Input
												type="text"
												id="pickup_location"
												className="form-control"
												placeholder="Start Typing Your Address"
												name="addressAuto"
												onChange={billingInfoForm.handleChange}
												// onBlur={(e) => {billingInfoForm.setFieldValue('addressAuto', e?.target?.value)}} // if client ask to show selected location same as google suggest
												onBlur={billingInfoForm?.handleBlur} // if client want to show actual value of selected location
												value={billingInfoForm.values.addressAuto || ""}
												invalid={
													billingInfoForm.touched.addressAuto &&
														billingInfoForm.errors.addressAuto
														? true
														: false
												}
											/>
												{billingInfoForm.touched.addressAuto &&
													billingInfoForm.errors.addressAuto ? (
													<>
														<FormFeedback type="invalid" className="info-modal">
															<img
																className="form-error-icon"
																src={rederror}
																alt=""
																height={15}
															/>
															{billingInfoForm.errors.addressAuto}
														</FormFeedback>
													</>
												) : null}</>
											
											: null}
									</div>
									{addressType === "Manually" && <>
									<div className="form-group manual_address_field">
											<Input
												type="text"
												className="form-control"
												placeholder="Start Typing Your Address"
												name="addressManual"
												onChange={billingInfoForm.handleChange}
												onBlur={billingInfoForm.handleBlur}
												value={billingInfoForm.values.addressManual || ""}
												invalid={
													billingInfoForm.touched.addressManual &&
														billingInfoForm.errors.addressManual
														? true
														: false
												}
											/>{billingInfoForm.touched.addressManual &&
												billingInfoForm.errors.addressManual ? (
												<>
													<FormFeedback type="invalid" className="info-modal">
														<img
															className="form-error-icon"
															src={rederror}
															alt=""
															height={15}
														/>
														{billingInfoForm.errors.addressManual}
													</FormFeedback>
												</>
											) : null}
											</div>
										<div className="form-group col-md-6 manual_address_field">
											<Input
												type="text"
												className="form-control"
												placeholder="City"
												name="city"
												onChange={billingInfoForm.handleChange}
												onBlur={billingInfoForm.handleBlur}
												value={billingInfoForm.values.city || ""}
												invalid={
													billingInfoForm.touched.city &&
														billingInfoForm.errors.city
														? true
														: false
												}
											/>
											{billingInfoForm.touched.city &&
												billingInfoForm.errors.city ? (
												<>
													<FormFeedback type="invalid" className="info-modal">
														<img
															className="form-error-icon"
															src={rederror}
															alt=""
															height={15}
														/>
														{billingInfoForm.errors.city}
													</FormFeedback>
												</>
											) : null}
										</div>
										<div className="form-group col-md-6 manual_address_field">
											<Input
												type="text"
												className="form-control"
												placeholder="Zip Code"
												name="zipCode"
												onChange={billingInfoForm.handleChange}
												onBlur={billingInfoForm.handleBlur}
												value={billingInfoForm.values.zipCode || ""}
												invalid={
													billingInfoForm.touched.zipCode &&
														billingInfoForm.errors.zipCode
														? true
														: false
												}
											/>
											{billingInfoForm.touched.zipCode &&
												billingInfoForm.errors.zipCode ? (
												<>
													<FormFeedback type="invalid" className="info-modal">
														<img
															className="form-error-icon"
															src={rederror}
															alt=""
															height={15}
														/>
														{billingInfoForm.errors.zipCode}
													</FormFeedback>
												</>
											) : null}
										</div>
										<div className="form-group manual_address_field">
											<Dropdown
												id="country"
												name="country"
												placeholder="Select Country"
												fluid
												search
												onChange={handleDropdownChange}
												options={countryList}
												className={(billingInfoForm.touched.country && billingInfoForm.errors.country) ? "input-outline is-invalid" : "input-outline step1-country-dropdown"}
												value={billingInfoForm?.values?.country || ""}
												onBlur={billingInfoForm.handleBlur}
												invalid={
													billingInfoForm.touched.country &&
														billingInfoForm.errors.country
														? "true"
														: "false"
												}
											/>
											{billingInfoForm.touched.country &&
												billingInfoForm.errors.country ? (
												<>
													<FormFeedback type="invalid" className="info-modal">
														<img
															className="form-error-icon"
															src={rederror}
															alt=""
															height={15}
														/>
														{billingInfoForm.errors.country}
													</FormFeedback>
												</>
											) : null}
										</div>

									</>}
									<div className="form-group manually_address">
										<span className="or">or</span>{" "}
										<span className="manual_address" onClick={() => setAddressType(addressType === "Automatically" ? "Manually" : "Automatically")}>
											Enter Address {addressType === "Automatically" ? "Manually" : "Automatically"}
										</span>

									</div>
									<button 
										className="btn btn-primary nextBtn btn-lg pull-right form-control" 
										type="submit"
										disabled={spinner.step1}
										ref={continueRef}
									>{spinner.step1? <div className="ui active inline loader"></div> : "Continue"}</button>
								</div>
							</Form>
						}
						{activeTab === "step-2" &&
							<Form onSubmit={(e) => {
								e.preventDefault()
								currencyInfoForm.handleSubmit()
								return false
							}}>
								<div className="row setup-content" id="step-2">
									<button
										className="btn btn-primary prevBtn btn-lg pull-left previous-btn-new"
										type="button"
										onClick={() => setActiveTab("step-1")}
									>
										<i className="feather icon-arrow-left"></i>
										Previous
									</button>
									<div className="col-xs-6 col-md-offset-3">
										<div className="col-md-12">
											<div className="form-group">
												<select
													id="currency"
													name="currency"
													aria-label="Default select example"
													className={(currencyInfoForm.touched.currency && currencyInfoForm.errors.currency) ? "form-select currency-select is-invalid" : "form-select currency-select"}
													onChange={currencyInfoForm.handleChange}
													value={currencyInfoForm?.values?.currency || ""}
													onBlur={currencyInfoForm.handleBlur}
													invalid={
														currencyInfoForm.touched.currency &&
															currencyInfoForm.errors.currency
															? "true"
															: "false"
													}

												>
													<option value="" >Select currency</option>
													{currencyList?.map((option, index) => {
														return <option key={index} value={option?.id}>{option?.label} ({option?.code})</option>
													})}
												</select>
												{currencyInfoForm.touched.currency &&
													currencyInfoForm.errors.currency ? (
													<>
														<FormFeedback type="invalid" className="info-modal">
															<img
																className="form-error-icon"
																src={rederror}
																alt=""
																height={15}
															/>
															{currencyInfoForm.errors.currency}
														</FormFeedback>
													</>
												) : null}
												<p className="mb-4">The currency will remain unchanged in the future</p>
											</div>
											<div className="form-group checkboxes">
												{gstCountry && <div className="form-check">
													<input 
														className="form-check-input" 
														type="checkbox" 
														id="gst" 
														name="gst"
														onChange={() => {}}
														onClick={() => setGstEnabled(!gstEnabled)}
														checked={gstEnabled}
													/>
													<label className="form-check-label" htmlFor="gst">Pay with GST</label>
												</div>}
												<div className="form-check">
													<Input 
														className="form-check-input" 
														type="checkbox"
														id="termConditions" 
														name="termConditions"
														onChange={currencyInfoForm.handleChange}
														onBlur={currencyInfoForm.handleBlur}
														value={currencyInfoForm.values.termConditions}
														defaultChecked={currencyInfoForm.values.termConditions}
														invalid={
														  currencyInfoForm.touched.termConditions &&
														  currencyInfoForm.errors.termConditions
															? true
															: false
														}
														
													/>
													<label htmlFor="termConditions">
														<span>I agree to the</span>
														<a className="text-primary" style={{cursor:'pointer'}}>
														{" "}
														Terms & Conditions
														</a>
													</label>
													{currencyInfoForm.touched.termConditions &&
													currencyInfoForm.errors.termConditions ? (
													<>
														<FormFeedback type="invalid" className="info-modal">
															<img
																className="form-error-icon"
																src={rederror}
																alt=""
																height={15}
															/>
															{currencyInfoForm.errors.termConditions}
														</FormFeedback>
													</>
												) : null}
												</div>
											</div>
											<button
												className="btn btn-primary nextBtn btn-lg pull-right form-control"
												// type="button"
												type="submit"
											>Continue</button>
										</div>
									</div>
								</div>
							</Form>}
						{/* </form> */}
					</div>
				</div>
			</div>
			{/* <ProgressBar loading={loading}/> */}
		</Modal>
	)
}

export default BillingAddressModal

