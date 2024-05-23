import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "@emotion/styled";

const GiphyBlock = styled.div`
  position: absolute;
  z-index: 9999;
  height: 290px;
  background: white;
  border: 3px solid black;
  width: 300px;
`;

const GridListOverflow = styled.div`
  height: 187px;
  overflow: auto;
`;

const GridList = styled.div`
  display: flex;
  flex-flow: row wrap;
  margin-left: 0px;
  width: 100%;
`;

const Container = styled.div`
  padding: 10px;
`;

const PickerBlock = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 4px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: #c4e17f;
    background-image: -webkit-linear-gradient(
      left,
      #fff35c,
      #fff35c,
      #ff6666,
      #ff6666,
      #9933ff,
      #9933ff,
      #00ccff,
      #00ccff,
      #00ff99,
      #00ff99
    );
    background-image: -moz-linear-gradient(
      left,
      #fff35c,
      #fff35c,
      #ff6666,
      #ff6666,
      #9933ff,
      #9933ff,
      #00ccff,
      #00ccff,
      #00ff99,
      #00ff99
    );
    background-image: -o-linear-gradient(
      left,
      #fff35c,
      #fff35c,
      #ff6666,
      #ff6666,
      #9933ff,
      #9933ff,
      #00ccff,
      #00ccff,
      #00ff99,
      #00ff99
    );
    background-image: -o-linear-gradient(
      left,
      #fff35c,
      #fff35c,
      #ff6666,
      #ff6666,
      #9933ff,
      #9933ff,
      #00ccff,
      #00ccff,
      #00ff99,
      #00ff99
    );
  }
`;

const CloseButton = styled.button``;

const GiphyBlockWrapper = styled.div`
  position: absolute;
  z-index: 9999;
  width: 300px;
`;

const GiphyApp = (props) => {
  const [gifs, setGifs] = useState([]);
  const [limit, setLimit] = useState(10);
  const [term, setTerm] = useState("");
  const [selectedGifSrc, setSelectedGifSrc] = useState("");
  const inputRef = useRef(null);
  const GiphyBlockWrapperRef = useRef(null);

  useEffect(() => {
    search("", "trend");
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        props.isGiphySearchOpen &&
        GiphyBlockWrapperRef.current &&
        !GiphyBlockWrapperRef.current.contains(e.target)
      ) {
        props.handleAppClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [props.isGiphySearchOpen]);

  const onSearchSubmit = (e) => {
    if (e.key !== "Enter") {
      return;
    }

    const searchTerm = inputRef.current.value;
    search(searchTerm);
  };

  const search = (searchTerm, kind = "search") => {
    const url =
      kind === "search"
        ? `https://api.giphy.com/v1/gifs/search?q=${searchTerm}`
        : `https://api.giphy.com/v1/gifs/trending?q=${searchTerm}`;
    const link = `${url}&limit=${limit}&api_key=${"pMo8LBgASaMilQP0lTMMQliZbRnpEBKD"}`;

    axios
      .get(link)
      .then((response) => {
        setGifs(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    const searchTerm = e.target.value;
    setTerm(searchTerm);
  };

  const handleGifClick = (gifSrc) => {
    setSelectedGifSrc(gifSrc);
    props.handleSelectedGif(gifSrc);
    props.handleAppClose();
  };

  return (
    <div>
      {props.isGiphySearchOpen ? (
        <GiphyBlockWrapper ref={GiphyBlockWrapperRef}>
          <GiphyBlock>
            <Container>
              <PickerBlock>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search Giphy"
                  value={term}
                  onChange={handleChange}
                  onKeyDown={onSearchSubmit}
                />
              </PickerBlock>

              <GridListOverflow>
                <GridList>
                  {gifs.map((o) => (
                    <img
                      alt="giphy"
                      key={`giphy-${o.id}`}
                      src={o.images.fixed_width_downsampled.url}
                      onClick={() =>
                        handleGifClick(o.images.fixed_width_downsampled.url)
                      }
                    />
                  ))}
                </GridList>
              </GridListOverflow>
            </Container>
            <CloseButton className="button" onClick={props.handleAppClose}>
              Close App
            </CloseButton>
          </GiphyBlock>
        </GiphyBlockWrapper>
      ) : null}
    </div>
  );
};

export default GiphyApp;
