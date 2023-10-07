import React, { useEffect, useState } from "react";
import { withRouter, Link, useHistory, useParams } from "react-router-dom";
import { getAnnouncementsDetail } from "../Authentication/store/apiServices";
import TextLoader from "../../components/textLoader";
import { toast } from "react-toastify";

const AnnouncmentDetail = (props) => {
  const params = useParams();
  const navigate = useHistory();
  const annoucmentId = params?.id;
  const [detail, setdetail] = useState();
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    annoucmentId ? getDetail() : navigate.push("/announcments");
  }, []);

  const getDetail = async () => {
    let param = new URLSearchParams({
      announcement_id: annoucmentId,
    });
    try {
      let res = await getAnnouncementsDetail(param);
      if (res) {
        setLoader(false);
        setLoading(false);
        res?.data?.data?.length == 0? navigate.push('/announcments') : setdetail(res?.data?.data) 
      }
    } catch (err) {
      toast.error(error?.response?.data?.message, {
        position: toast.POSITION.TOP_RIGHT,
      })
      setLoader(false);
      setLoading(false);
      navigate.push('/announcments')
    }
  };
  return (
    <div
      className={
        loader ? "announcement-detail overlayerloader" : "announcement-detail"
      }
    >
      <section className="rs-product-section">
        <div className="rs-product-left">
          <div className="rs-product-left-title rs-product-left-title-wrap">
            <h2>Announcements ✨</h2>
          </div>
          <div className="rs-product-left-contentbar rs-product-left-contentbar-wrap">
            <div className="row">
              <div className="col-lg-12">
                <div className="rs-read-announcements-card">
                  <div className="rs-read-announcements-card-header">
                    <ul>
                      <li>
                        {" "}
                        <Link to="/announcments">Announcements ›</Link>{" "}
                      </li>
                      <li>{detail?.title ? detail?.title : "-"}.</li>
                    </ul>
                  </div>
                  <div className="rs-read-announcements-card-body">
                    <h2>
                      {detail?.title ? detail?.title : "-"}{" "}
                      <small>
                        Updated on {detail?.date} • Published on {detail?.date}
                      </small>{" "}
                    </h2>
                    <div className="rs-read-announcements-card-content">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: detail?.announcement,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-20">
              <Link
                to="/announcments"
                type="button"
                style={{
                  backgroundColor: "#285a3d",
                  borderRadius: "7px",
                  color: "white",
                }}
                className="btn btn-light"
              >
                &#x2039;&#x2039;&nbsp; Back
              </Link>
            </div>
          </div>
        </div>
      </section>
     <TextLoader loading={loading} loader={loader}/>
    </div>
  );
};
export default withRouter(AnnouncmentDetail);
