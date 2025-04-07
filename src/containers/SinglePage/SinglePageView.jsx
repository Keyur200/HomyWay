import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLocation } from 'library/hooks/useLocation';
import Sticky from 'react-stickynode';
import { Row, Col, Modal, Button } from 'antd';
import Container from 'components/UI/Container/Container';
import Loader from 'components/Loader/Loader';
import useWindowSize from 'library/hooks/useWindowSize';
import Description from './Description/Description';
import Amenities from './Amenities/Amenities';
import Location from './Location/Location';
import Review from './Review/Review';
import Reservation from './Reservation/Reservation';
import BottomReservation from './Reservation/BottomReservation';
import TopBar from './TopBar/TopBar';
import SinglePageWrapper, { PostImage } from './SinglePageView.style';
import PostImageGallery from './ImageGallery/ImageGallery';
import useDataApi from 'library/hooks/useDataApi';
import isEmpty from 'lodash/isEmpty';
import axios from 'axios';
import { api } from '../../api';

const SinglePage = () => {
  let { id } = useParams();
  const { href } = useLocation();
  const [isModalShowing, setIsModalShowing] = useState(false);
  const { width } = useWindowSize();

  let url = '/data/hotel-single.json';
  if (!id) {
    url += slug;
  }

  const [property,setProperty] = useState({})
  const getProperty = async() => {
    const res = await axios.get(`${api}Property/${id}`)
    console.log(res.data)
    setProperty(res.data)
  }
  useEffect(()=>{
    getProperty()
  },[])

  const { data, loading } = useDataApi(url);
  if (isEmpty(data) || loading) return <Loader />;
  const {
    reviews,
    rating,
    ratingCount,
    price,
    title,
    gallery,
    location,
    content,
    amenities,
    author,
  } = data[0];

  return (
    <SinglePageWrapper>
      <PostImage>
        <img
          className="absolute"
          src="/images/single-post-bg.jpg"
          alt="Listing details page banner"
        />
        <Button
          type="primary"
          onClick={() => setIsModalShowing(true)}
          className="image_gallery_button"
        >
          View Photos
        </Button>
        <Modal
          open={isModalShowing}
          onCancel={() => setIsModalShowing(false)}
          footer={null}
          width="100%"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }}
          wrapClassName="image_gallery_modal"
          closable={false}
        >
          <Fragment>
            <PostImageGallery />
            <Button
              onClick={() => setIsModalShowing(false)}
              className="image_gallery_close"
            >
              <svg width="16.004" height="16" viewBox="0 0 16.004 16">
                <path
                  id="_ionicons_svg_ios-close_2_"
                  d="M170.4,168.55l5.716-5.716a1.339,1.339,0,1,0-1.894-1.894l-5.716,5.716-5.716-5.716a1.339,1.339,0,1,0-1.894,1.894l5.716,5.716-5.716,5.716a1.339,1.339,0,0,0,1.894,1.894l5.716-5.716,5.716,5.716a1.339,1.339,0,0,0,1.894-1.894Z"
                  transform="translate(-160.5 -160.55)"
                  fill="#909090"
                />
              </svg>
            </Button>
          </Fragment>
        </Modal>
      </PostImage>

      <TopBar title={title} shareURL={href} author={author} media={gallery} />

      <Container>
        <Row gutter={30} id="reviewSection" style={{ marginTop: 30 }}>
          <Col xl={16}>
            <Description
              content={content}
              title={property?.propertyName}
              location={location}
              rating={rating}
              ratingCount={ratingCount}
            />
            <Amenities amenities={amenities} />
            <Location location={data[0]} />
          </Col>
          <Col xl={8}>
            {width > 1200 ? (
              <Sticky
                innerZ={999}
                activeClass="isSticky"
                top={202}
                bottomBoundary="#reviewSection"
              >
                <Reservation />
              </Sticky>
            ) : (
              <BottomReservation
                title={property?.propertyName}
                price={property?.propertyPrice}
                rating={rating}
                ratingCount={ratingCount}
              />
            )}
          </Col>
        </Row>
        <Row gutter={30}>
          <Col xl={16}>
            <Review
              reviews={reviews}
              ratingCount={ratingCount}
              rating={rating}
            />
          </Col>
          <Col xl={8} />
        </Row>
      </Container>
    </SinglePageWrapper>
  );
};

export default SinglePage;
