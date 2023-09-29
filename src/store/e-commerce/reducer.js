import {
  GET_CART_DATA_FAIL,
  GET_CART_DATA_SUCCESS,
  GET_CUSTOMERS_FAIL,
  GET_CUSTOMERS_SUCCESS,
  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAIL,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_FAIL,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAIL,
  GET_ORDERS_FAIL,
  GET_ORDERS_SUCCESS,
  GET_PRODUCTS,
  GET_PRODUCTS_FAIL,
  GET_PRODUCTS_SUCCESS,
  GET_SHOPS_FAIL,
  GET_SHOPS_SUCCESS,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_DETAIL_FAIL,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAIL,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,

  //for live project
  GET_SERVICES,
  GET_SERVICES_SUCCESS,
  GET_SERVICES_FAIL,
  GET_CLIENTS_SUCCESS,
  GET_CLIENTS_FAIL,
  GET_CARDS,
  GET_CARDS_SUCCESS,
  GET_CARDS_FAIL,
  GET_SERVICES_DETAIL_SUCCESS,
  GET_SERVICES_DETAIL_FAIL,
  GET_HARDWARE_DETAIL_SUCCESS,
  GET_HARDWARE_DETAIL_FAIL,
  GET_IP_LIST_SUCCESS,
  GET_IP_LIST_FAIL
} from "./actionTypes"

const INIT_STATE = {
  products: [],
  product: {},
  orders: [],
  cartData: {},
  cards: null,
  customers: [],
  shops: [],
  error: {},

  // for project live state.
  services: [],
  servicesDetail: null,
  hardware: null,
  clients: [],
  ipList: null
}

const Ecommerce = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
      }

    case GET_PRODUCTS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        product: action.payload,
      }

    case GET_PRODUCT_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload,
      }

    case GET_ORDERS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

      case ADD_ORDER_SUCCESS:
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };

    case ADD_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case UPDATE_ORDER_SUCCESS:
        return {
          ...state,
          orders: state.orders.map(order =>
            order.id.toString() === action.payload.id.toString()
              ? { order, ...action.payload }
              : order
          ),
        };

    case UPDATE_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.filter(
          order => order.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_CART_DATA_SUCCESS:
      return {
        ...state,
        cartData: action.payload,
      }

    case GET_CART_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_CUSTOMERS_SUCCESS:
      return {
        ...state,
        customers: action.payload,
      }

    case GET_CUSTOMERS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    // for live project
    case GET_SERVICES_SUCCESS:
      return {
        ...state,
        services: action.payload,
      }

    case GET_SERVICES_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    case GET_SERVICES_DETAIL_SUCCESS:
      return {
        ...state,
        servicesDetail: action.payload,
      }

    case GET_SERVICES_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
    }
    case GET_HARDWARE_DETAIL_SUCCESS:
      return {
        ...state,
        hardware: action.payload,
      }
  
    case GET_HARDWARE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    case GET_IP_LIST_SUCCESS:
      return {
        ...state,
        ipList: action.payload,
      }
  
    case GET_IP_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      }
    case GET_CARDS_SUCCESS:
      return {
        ...state,
        cards: action.payload,
      }

    case GET_CARDS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    case GET_CLIENTS_SUCCESS:
      return {
        ...state,
        clients: action.payload,
      }

    case GET_CLIENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      }
      case ADD_CUSTOMER_SUCCESS:
        return {
          ...state,
          customers: [...state.customers, action.payload],
        };
  
      case ADD_CUSTOMER_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case UPDATE_CUSTOMER_SUCCESS:
        return {
          ...state,
          customers: state.customers.map(customer =>
            customer.id.toString() === action.payload.id.toString()
              ? { customer, ...action.payload }
              : customer
          ),
        };
  
      case UPDATE_CUSTOMER_FAIL:
        return {
          ...state,
          error: action.payload,
        };
  
      case DELETE_CUSTOMER_SUCCESS:
        return {
          ...state,
          customers: state.customers.filter(
            customer => customer.id.toString() !== action.payload.id.toString()
          ),
        };
  
      case DELETE_CUSTOMER_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    

    case GET_SHOPS_SUCCESS:
      return {
        ...state,
        shops: action.payload,
      }

    case GET_SHOPS_FAIL:
      return {
        ...state,
        error: action.payload,
      }
      case GET_PRODUCTS:
      return {
          ...state,
          services: action.payload,
        }

    default:
      return state
  }
}

export default Ecommerce
