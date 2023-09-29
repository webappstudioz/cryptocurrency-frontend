import axios from "axios";
import { del, get, post, put } from "../../../helpers/api_helper";
import * as url from "../../../helpers/url_helper";
import { postNew, getNew } from "../../../helpers/api_helper_rs"; 

// for live project get services
export const getOSControls = (config) => getNew(url.OS_CONTROLS, config);
 