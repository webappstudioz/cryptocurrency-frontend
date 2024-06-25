//C2C
//auth
export const GET_COUNTRY = "/get/countries"
export const REGISTER = "/user/register"
export const RESEND = "/user/otp/resend/"
export const VERIFICATION = "/user/otp/verify"
export const LOGIN = "/login"
export const FORGET_PASSWORD = "/user/reset/password"
export const RESET_PASSWORD = "/user/set-new/password"
export const VERIFY_RESET_TOKEN = "/user/reset-password/"

//Admin
export const ALL_USERS_LIST = "/user/list"
export const GET_USER_DETAILS = "/user/detail/"
export const UPDATE_USER_STATUS = "/user/change/status"
export const ADMIN_ACC_DETAILS = "/admin/account/detail"

//User
export const UPDATE_USER_PROFILE = "/user/detail/"
export const GET_TEAM_LIST = "/team/list/"
export const CHANGE_PASSWORD = "/user/change-password"
export const PAYMENTS = "/payment"
export const WITHDRAW_FUNDS = ""
export const TRANSFER_FUNDS = ""
export const GET_INVOICES = "/payment/list"

//REGISTER
export const GOOGLE_LOGIN = "/auth/google"

//LOGIN
// export const FORGET_PASSWORD = "/forgot/password"
// export const RESET_PASSWORD = "/reset/password"
export const RESEND_PASS_LINK = "/resend/password/"
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd"
export const SOCIAL_LOGIN = "/social-login"


//
export const TIMEZONES = "/timezone/list"
export const STOREGAMERESULTS = "/store/results"
export const GETGAMERESULTS = "/get/game/results"

//
export const GET_USER_INFO = "/get/profile"
export const POST_USER_INFO = "/update/profile"

//unused
//PROFILE
export const CHECKUSER = "/silent-check"
export const SIGNUP_SILENT= "/silent-signup"
export const WEDGITSINFO = "/dashboard"
// export const CHANGE_PASSWORD = "/profile/change-password"
export const GET_CLIENT_INFO = "/profile/profile-details"

export const POST_CLIENT_INFO = "/profile/update-profile"
export const GST_COUNTRIES = "/get/gst-countries"
export const POST_COUNTRY = "/get/states" 
// export const GET_USER_DETAILS = "/user-details"


//TWO FACTOR SETTING
export const GETQRCODE = "/profile/enable/two-factor"
export const VERIFY2FCODE = "/profile/enable/two-factor/verify"
export const DISABLE2FA = "/profile/disable/two-factor"
export const VERIFIY2FAOTP = "/verify/two-factor"
// export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile"
// export const POST_EDIT_PROFILE = "/post-fake-profile"

//PRODUCTS SVERVERS

export const GET_PRODUCTS = "/products"
export const GET_PRODUCTS_DETAIL = "/products/detail/"
export const SEARCH_PROD = "/products/list?search="
export const GET_DEVICE_DETAILS = "/server"
export const DOWNLOAD_KVM = "/server/file/"
export const GET_DATA_TRAFFIC = "/data-traffic"
export const GET_DATA_BANDWIDTH = "/data-bandwidth"
export const OS_INSTALL = "/lw/install-os"
export const GET_OS_LIST = "/lw/getOS" 
export const GET_OS_CONFIG = "/lw/getOS-config"
export const GET_OSINSTALLATION_INFO = "/lw/get-job"
export const ALL_OS_INSTALL_SERVERS = "/lw/list-user-job"
export const CACEL_INSTALLATION = "/lw/cancel-job"
//PRODUCTS
export const PRODUCTS_LIST = "/product/list"
export const PRODUCT_DETAIL = "/product/detail"
export const CUSTOM_PROD_LIST = "/product/custom/list"
export const UPDATE_CONFIGURATION = "/product/update/config"
export const COPY_CONFIGURATION = "/product/link/copy"
export const GET_CONFIGURATION = "/product/link/data"
export const UPDATE_PROD_QUANTITY = "/product/update/quantity"
export const APPLY_PROMO_CODE = "/cart/apply-promo"
export const CURRENCY_LIST = "/get/currencies"
export const ADD_TO_CART = "/cart/add"
export const CART_LIST = "/cart/list"
export const CART_DETAIL = "/cart/checkout"
export const UPDATE_CURRENCY = "/product/update/currency"
export const REMOVE_PRODUCT = "/cart/remove"
export const COPY_CART_LINK = "/cart/link/copy"
export const GET_CART_LINK = "/cart/link/data"
export const PLACE_ORDER = "/place-order"
export const ORDER_CONFIRMATION = "/send-order-confirmation"
export const DELETE_PROMO_CODE = "/cart/remove-promo"
export const SYNC_SERVICE = "/sync-service"
export const SYNC_ALL_SERVICES = "/sync-user-services"

// ----------------------------
//CALENDER
export const GET_EVENTS = "/events"
export const ADD_NEW_EVENT = "/add/event"
export const UPDATE_EVENT = "/update/event"
export const DELETE_EVENT = "/delete/event"
export const GET_CATEGORIES = "/categories"

//CHATS
export const GET_CHATS = "/chats"
export const GET_GROUPS = "/groups"
export const GET_CONTACTS = "/contacts"
export const GET_MESSAGES = "/messages"
export const ADD_MESSAGE = "/add/messages"

//ORDERS
export const GET_ORDERS = "/orders"
export const ADD_NEW_ORDER = "/add/order"
export const UPDATE_ORDER = "/update/order"
export const DELETE_ORDER = "/delete/order"
export const SEND_STRIPE_DETAILS_BACK = "/payment-capture"
export const PAYMENTMETHOD_LIST ="/get/payment-method/list"
export const ADD_WALLET_AMOUNT = "/wallet/add-amount"
export const CONFIRM_PAGE_DETAIL = "/order-detail"
export const PAYMENT_CONFIRM="/payment-capture-confirm"
export const APPLY_CREDIT= "/invoice/apply-credit"
export const RAZORPAY_CAPTURE = "/razorpay-capture"
export const SUPPORT_PIN = "/user/support-pin"

//CART DATA
export const GET_CART_DATA = "/cart"
export const EMPTY_CART = "/cart/empty"
export const UPDATE_CART = "/update-cart"

//CUSTOMERS
export const GET_CUSTOMERS = "/customers"
export const ADD_NEW_CUSTOMER = "/add/customer"
export const UPDATE_CUSTOMER = "/update/customer"
export const DELETE_CUSTOMER = "/delete/customer"

//SHOPS
export const GET_SHOPS = "/shops"

//CRYPTO
export const GET_WALLET = "/wallet"
export const GET_CRYPTO_ORDERS = "/crypto/orders"

//INVOICES
// export const GET_INVOICES = "/invoice/list"
export const GET_INVOICE_DETAIL = "/invoice/view"
export const GET_INVOICE_PREVIEW = "/invoice/check"
export const GET_INVOICE_DOWNLOAD = "/invoice/download"
export const ADD_NEW_INVOICE = "/add/invoice"
export const UPDATE_INVOICE = "/update/invoice"
export const DELETE_INVOICE = "/delete/invoice"
export const INVOICE_PAY = "/invoice/payment"
export const SYNC_INVOICES = "/sync-invoices"
export const PAYMENT_FORMS = "/invoice/pay"
//PROJECTS
export const GET_PROJECTS = "/projects"
export const GET_PROJECT_DETAIL = "/project"
export const ADD_NEW_PROJECT = "/add/project"
export const UPDATE_PROJECT = "/update/project"
export const DELETE_PROJECT = "/delete/project"

//TASKS
export const GET_TASKS = "/tasks"

//CONTACTS
export const GET_USERS = "/users"
export const GET_USER_PROFILE = "/user"
export const ADD_NEW_USER = "/add/user"
export const UPDATE_USER = "/update/user"
export const DELETE_USER = "/delete/user"
export const COMPLETE_PROFILE = "/profile/complete-profile"
export const UPDATE_PROFILE_SILENT = "/profile/silent-profile-update"
// for live project api integration
// export const GET_SERVICES = ""

// export const GET_SERVICES_DETAIL = "";
// export const GET_HARDWARE_DETAIL = "";
// export const GET_IP_LIST = "";
// invoice
// export const GET_INVOICES_LIST = ""
// FOR TICKET LIST
// export const GET_TICKET_LIST = ""
// for get clients
// export const GET_CLIENTS = ""
// export const GET_CARDS = ""
// export const GET_BANDWIDTH = ""
// export const GET_DATATRAFFIC = ""
export const REBOOT = "/easy-dcim/device/reboot" 
// export const REGISTER_CONFIRM = "";
export const CANCEL_SERVER = "/service/cancel";
export const SEND_INVITE = "/user/send/invite";
export const VERIFY_INVITE = "/user/verify/invite";
export const INVITE_LIST = "/user/invite/list";
export const RESEND_INVITATION = "/user/invite/resend";
export const CANCEL_INVITATION = "/user/invite/cancel";
export const REMOVE_ACCESS = "/user/access/remove";
export const UPDATE_PERMISSIONS= "/user/permissions/update";
export const SEND_INVOICE_MAIL = "/invoice/email";
// export const FORGET_PASSWORD = "";
// export const OS_CONTROLS = ""

///graphs
export const DATA_TRAFFIC = "/server/device/lease"
//Announcements
export const Announcements = "/announcement/list"
export const AnnouncementDetail = "/announcement/detail"
//support
// export const SupportDepartment = "/ticket/support-departments"
export const SupportDepartment = "/ticket/departments"
// export const TicketListing = "/ticket/list"
export const createTicket = "/tickets"
export const ipList = "/user/dedicated-ip"

//notification
export const NOTIFICATION_LIST = "/notification/list"
export const MARK_ALL_READ = "/notification/mark-read"

//payments
export const GET_SAVED_CARDS = "/payment-methods"