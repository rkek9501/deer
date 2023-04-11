import React, { useCallback, useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Modal from "react-modal";

import styled from "styled-components";
import Button from "./Button";
import Icons from "./Icons";

Modal.setAppElement("#__next");

const customStyles = {
  overlay: {
    zIndex: 10,
    top: "50%",
    left: "50%",
    backgroundColor: "rgba(100, 100, 100, 0.75)",
    transform: "translate(-50%, -50%)",
    width: "calc(100vw)",
    height: "calc(var(--vh, 1vh) * 100)",
    minWidth: 600
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    maxWidth: "calc(100vw - 200px)",
    maxHeight: "calc(var(--vh, 1vh) * 100 - 100px)",
    transform: "translate(-50%, -50%)"
  }
};

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  .modal-header {
    width: 100%;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-weight: 800;
    font-family: score4;
    font-size: 1.6rem;
  }
  .modal-body {
    min-width: 300px;
    .modal-buttons {
      button {
        position: relative;
      }
      input[type="file"] {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 2;
        opacity: 0;
      }
    }
    .remove-question {
      font-size: 1.3rem;
      margin-bottom: 20px;
      color: red;
    }
  }
  .modal-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    *:nth-child(1) {
      margin-right: 10px;
    }
  }
`;

const PrevArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const ModalImg = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50px;
  border: solid 2px #ff708b;
`;

type ImageTypes = {
  data: any;
  url: string | null;
};

const ImgCropModal = (Props: { open: boolean; existImg: boolean; callback: any }) => {
  const [crop, setCrop] = useState<any>({ unit: "%", width: 50, aspect: 1 });
  const [imgRef, setRef] = useState(null);
  const [src, setSrc] = useState<any>(null);
  const [cropSrc, setCropSrc] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<ImageTypes>({ data: null, url: null });

  useEffect(() => {
    if (step === 1 && file.data) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(file.data);
    }
  }, [step, file]);

  const onImageLoaded = (image: any) => setRef(image);

  const onCropComplete = async (crop: any) => {
    if (imgRef && crop.width && crop.height) {
      const croppedUrl = await getCroppedImg(imgRef, crop, "newFile.jpeg");
      setCropSrc(croppedUrl);
    }
  };

  const onCropChange = (crop: any, percentCrop: any) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    setCrop(crop);
  };

  const getCroppedImg = (image: any, crop: any, fileName: string) => {
    const canvas = document.createElement("canvas");
    const pixelRatio = window.devicePixelRatio;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "low"; // "high";
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    // console.log(
    //   "!!!!!!!!",
    //   image,
    //   crop.x * scaleX,
    //   crop.y * scaleY,
    //   crop.width * scaleX,
    //   crop.height * scaleY,
    //   0,
    //   0,
    //   crop.width * scaleX,
    //   crop.height * scaleY
    // );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blobs: any) => {
          if (!blobs) {
            //reject(new Error('Canvas is empty'));
            console.error("Canvas is empty");
            return;
          }
          blobs.name = fileName;
          window.URL.revokeObjectURL(cropSrc);
          const newblob = window.URL.createObjectURL(blobs);
          resolve(newblob);
        },
        "image/jpeg",
        1
      );
    });
  };

  const gotoPrevStep = () => {
    setStep(0);
    setFile({ data: null, url: null });
  };
  const gotoRemoveStep = () => setStep(2);

  const onClickRemoveImgBtn = () => {
    Props.callback({ type: "remove" });
  };

  const onClickChangeImgBtn = (e: any) => {
    e.stopPropagation();
    const data = e.target.files[0];
    const blobUrl = URL.createObjectURL(data).toString();
    setFile({ data, url: blobUrl });
    setStep(1);
  };

  const onClickSave = useCallback(() => {
    Props.callback({ type: "change", data: cropSrc, name: file.data.name });
  }, [file, cropSrc]);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Modal
        isOpen={Props.open}
        onRequestClose={() => Props.callback({ type: "close" })}
        style={customStyles}
        contentLabel="Image Crop Modal"
      >
        <ModalBody>
          <div className="modal-header">
            <div>프로필 이미지 편집</div>
            <div onClick={() => Props.callback({ type: "close" })}>
              <Icons.Close />
            </div>
          </div>
          {step === 0 && (
            <>
              <div className="modal-body">
                <div className="modal-buttons">
                  {Props.existImg && <Button onClick={gotoRemoveStep}>이미지 삭제</Button>}
                  <Button onClick={(e) => e.stopPropagation()}>
                    이미지 변경
                    <input
                      type="file"
                      onChange={onClickChangeImgBtn}
                      accept="image/jpg,impge/png,image/jpeg,image/gif"
                    />
                  </Button>
                </div>
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="modal-body">
                {src && (
                  <ReactCrop
                    src={src}
                    crop={crop}
                    ruleOfThirds
                    onImageLoaded={onImageLoaded}
                    onComplete={onCropComplete}
                    onChange={onCropChange}
                  />
                )}
                <PrevArea>
                  미리보기
                  <ModalImg id="crop" className="crop-img" src={cropSrc} />
                </PrevArea>
              </div>
              <div className="modal-footer">
                <Button onClick={gotoPrevStep}>이전</Button>
                <Button onClick={onClickSave}>저장</Button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="modal-body">
                <div className="remove-question">정말로 프로필 이미지를 삭제하시겠습니까?</div>
              </div>
              <div className="modal-footer">
                <Button onClick={gotoPrevStep}>이전</Button>
                <Button onClick={onClickRemoveImgBtn}>삭제</Button>
              </div>
            </>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ImgCropModal;
