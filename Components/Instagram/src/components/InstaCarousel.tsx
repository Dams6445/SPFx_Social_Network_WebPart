import * as React from 'react';
// import styles from '../webparts/instaPublication/InstaPublication.module.scss';
import Slider from "react-slick";
import "../../node_modules/slick-carousel/slick/slick.css";
import "../../node_modules/slick-carousel/slick/slick-theme.css";
import * as InstaVideo from './InstaVideo';
import * as InstaImage from './InstaImage';

export function SimpleSlider(props) {
  const settings = {
    arrows: false,
    centerMode: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
  };
  console.log("props.tabData.data du carousel : ", props.tabData.data)
  console.log("props.tabData.data[0] du carousel : ", props.tabData.data[0])
  var tab: string[] = [""];
  for (let index = 0; index < props.tabData.data.length; index++) {
    tab[index] = props.tabData.data[index].media_url;
  }
  console.log("c'est le tab du carousel : ", tab)
  return (
    <div>
      <Slider {...settings}>
        {tab.map((source) =>
          <div>            
            {
              (source) && (source.substr(0, 9) == "https://s") && (<InstaImage.Image mediaURL={source} origine="ImagePublication" />)
            }
            {
              (source) && (source.substr(0, 9) == "https://v") && (<InstaVideo.Video mediaURL={source} origine="Publication" />)
            }
          </div>
        )}
      </Slider>
    </div>
  );
}