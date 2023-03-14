import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

import Textcard from "@components/Card";

import SwiperCore, { A11y, Controller, Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

SwiperCore.use([Navigation, Controller, A11y, Thumbs]);

const CarouselContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const SlideContainer = styled.div`
  .swiper {
    padding: 0 4rem;
    display: flex;
    flex: 1;
    @media (min-width: 1px) and (max-width: 480px) {
      padding: 0 1rem;
    }
    .swiper-slide {
      width: fit-content !important;
      margin-right: 2rem !important;
      @media (min-width: 1px) and (max-width: 480px) {
        /* width: calc(100% - 7.5rem) !important; */
        min-width: 300px;
      }
    }
    .swiper-slide:last-child {
      margin-right: 0px !important;
    }
  }
  #slide-to-prev,
  #slide-to-next {
    /* position: absolute; */
    display: flex;
    width: 22px;
    height: 44px;
    @media (min-width: 1px) and (max-width: 480px) {
      display: none;
    }
  }

  padding: 2.2.rem;
  width: calc(100% - 44px);
  /* smartphones, iPhone, portrait 480x320 phones */
  @media (min-width: 1px) and (max-width: 480px) {
    width: calc(100vw);
  }
`;

const Carousel = ({ contents }: any) => {
  const [posts] = useState<any>(contents || []);
  const [isMounted, setMounted] = useState(false);
  let swiper = useRef<any>(null);

  useEffect(() => {
    if (posts.length > 0) setMounted(true);
  }, [posts]);

  useLayoutEffect(() => {
    if (typeof window !== "undefined")
      new SwiperCore(".swiper", {
        slidesPerView: "auto",
        direction: "horizontal",
        // slidesPerView: 3,
        rewind: true,
        navigation: {
          nextEl: "#slide-to-next",
          prevEl: "#slide-to-prev"
        }
      });
  }, [isMounted]);

  if (posts.length === 0) return null;

  return (
    <CarouselContainer>
      <h4 className="slider-title">이런 글은 어떠세요?</h4>
      <SlideContainer>
        <div id="slide-to-prev" className="swiper-button-prev" />
        <div className="swiper" ref={swiper}>
          <div className="swiper-wrapper">
            {posts.map((post: any, id: number) => (
              <div className="swiper-slide" key={id}>
                <Textcard key={id} post={post} size="small" />
              </div>
            ))}
          </div>
        </div>
        <div id="slide-to-next" className="swiper-button-next" />
      </SlideContainer>
    </CarouselContainer>
  );
};

export default Carousel;
