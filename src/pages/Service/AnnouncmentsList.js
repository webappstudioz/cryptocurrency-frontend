import React, { useEffect, useState } from "react";
import { withRouter, Link, useHistory } from "react-router-dom";
import arrowRight from "../../assets/images/arrowRight.svg";
import { getAnnouncements } from "../Authentication/store/apiServices";
import Pagination from "react-bootstrap/Pagination";
import TextLoader from "../../components/textLoader";
import { setPageTitle } from "../../helpers/api_helper_rs";
import BillingAddressModal from "../../components/Common/billingAdressModal";

const AnnouncmentsList = (props) => {
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [allAnouncements, setallAnouncements] = useState();
  const [filteredAnnouncements, setfilteredAnnouncements] = useState([]);
  const [allMonths, setallMonths] = useState();
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Parse the page number from the URL, or default to 1
    const params = new URLSearchParams(history.location.search);
    const page = parseInt(params.get("page")) || 1;
    setCurrentPage(page);
  }, [history]);

  useEffect(() => {
    setPageTitle("Announcments")
    getAnnounceList();
  }, []);

  const getAnnounceList = async () => {
    try {
      let res = await getAnnouncements();
      if (res) {
        setLoader(false);
        setLoading(false);
        setallAnouncements(
          JSON.parse(JSON.stringify(res?.data?.data?.announcement))
        );
        setallMonths(res?.data?.data?.dates);
        const result = [];
        for (const prop in res?.data?.data?.announcement) {
          if (Array.isArray(res?.data?.data?.announcement[prop])) {
            res?.data?.data?.announcement[prop].forEach((obj) =>
              result.push(obj)
            );
          } else {
            result.push(res?.data?.data?.announcement[prop]);
          }
        }
        setfilteredAnnouncements(result);
      }
    } catch (err) {
      setLoader(false);
      setLoading(false);
    }
  };

  const filterMonths = (index) => {
    let all = document.getElementsByClassName("monthFilter");
    let view = document.getElementsByClassName("viewall");
    view[0].classList.remove("active");
    for (let i = 0; i < all.length; i++) {
      if (i == index) {
        all[i].classList.add("active");
      } else {
        all[i].classList.remove("active");
      }
    }

    setfilteredAnnouncements(
      allAnouncements[Object.keys(allAnouncements)[index]]
    );

    setCurrentPage(1);
  };
  const viewall = () => {
    let view = document.getElementsByClassName("viewall");
    view[0].classList.add("active");
    let all = document.getElementsByClassName("monthFilter");

    for (let i = 0; i < all.length; i++) {
      all[i].classList.remove("active");
    }
    const result = [];
    for (const prop in allAnouncements) {
      if (Array.isArray(allAnouncements[prop])) {
        allAnouncements[prop].forEach((obj) => result.push(obj));
      } else {
        result.push(allAnouncements[prop]);
      }
    }
    setfilteredAnnouncements(result);
    setCurrentPage(1);
  };
  ////////////////////////////////////////////////////////////
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Calculate the index of the first and last items on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAnnouncements.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);

  // Generate an array of page numbers
  const pageNumbers = [];
  if (totalPages <= 10) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
  } else {
    let startPage, endPage;
    if (currentPage <= 6) {
      startPage = 1;
      endPage = 10;
    } else if (currentPage + 4 >= totalPages) {
      startPage = totalPages - 9;
      endPage = totalPages;
    } else {
      startPage = currentPage - 5;
      endPage = currentPage + 4;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);

      pageNumbers.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          {1}
        </Pagination.Item>
      );

      pageNumbers.unshift(
        <Pagination.Ellipsis key="ellipsis-start" disabled />
      );
    }
  }
  const handlePageClick = (pageNumber) => {
    // Update the current page state
    setCurrentPage(pageNumber);

    // Update the URL to reflect the current page
    const newUrl = `${history.location.pathname}?page=${pageNumber}`;
    history.push(newUrl);
  };
  const handleFirstClick = () => handlePageClick(1);
  const handlePrevClick = () => handlePageClick(currentPage - 1);
  const handleNextClick = () => handlePageClick(currentPage + 1);
  const handleLastClick = () => handlePageClick(totalPages);

  return (
    <div
      className={
        loader ? "announcement-page overlayerloader" : "announcement-page"
      }
    >
      <section className="rs-product-section">
        <div className="rs-product-left">
          <div className="rs-product-left-title rs-product-left-title-wrap">
            <h2>Announcements ✨</h2>
          </div>
          <div className="rs-product-left-contentbar rs-product-left-contentbar-wrap">
            <div className="row">
              <div className="col-lg-3">
                <div className="rs-product-left-box h-full">
                  <h6>
                    {" "}
                    <li
                      onClick={viewall}
                      className="viewall active"
                      style={{ cursor: "pointer", listStyle: "none" }}
                    >
                      View All
                    </li>{" "}
                  </h6>
                  <ul>
                    {allMonths?.map((month, index) => {
                      return (
                        <li
                          key={index}
                          className="monthFilter"
                          style={{ cursor: "pointer" }}
                          onClick={() => filterMonths(index)}
                        >
                          {month}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="col-lg-9">
                <div className="announcements-list-card">
                  <ul>
                    {currentItems?.map((item, index) => {
                      return (
                        <li key={index}>
                          <Link to={`/announcmentDetail/${item.id}`}>
                            <h4>
                              {item?.title ? item?.title : "-"}
                              <small>Published on {item.date}</small>{" "}
                            </h4>{" "}
                            <img src={arrowRight} alt="" />{" "}
                          </Link>
                        </li>
                      );
                    })}
                    <nav
                      aria-label="Page navigation example"
                      className="table-responsive"
                    >
                      <Pagination className="custom-pagination">
                        <Pagination.First
                          onClick={handleFirstClick}
                          disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                          onClick={handlePrevClick}
                          disabled={currentPage === 1}
                        />

                        {pageNumbers}

                        <Pagination.Next
                          onClick={handleNextClick}
                          disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                          onClick={handleLastClick}
                          disabled={currentPage === totalPages}
                        />
                      </Pagination>
                    </nav>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <BillingAddressModal /> */}
      <TextLoader loading={loading} loader={loader}/>
    </div>
  );
};

export default withRouter(AnnouncmentsList);
