import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Box, Button, Modal } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import styled from "styled-components";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  // height: 600,
  bgcolor: "white",
  boxShadow: 24,
  px: 4,
  pb: 3
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
  }
  .modal-body {
  }
  .modal-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
`;

const PrevArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  margin: 20px;
`;

const ModalImg = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50px;
  border: solid 2px #ff708b;
`;

const ImgCropModal = (Props: { open: boolean; onClose: any; file: any; callback: any }) => {
  const [crop, setCrop] = useState<any>({ unit: "%", width: 50, aspect: 1 / 1 });
  const [imgRef, setRef] = useState(null);
  const [src, setSrc] = useState<any>(null);
  const [cropSrc, setCropSrc] = useState<any>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener("load", () => setSrc(reader.result));
    reader.readAsDataURL(Props.file.data);
  }, []);

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

  const onClickSave = useCallback(() => {
    Props.callback(cropSrc);
    Props.onClose();
  }, [cropSrc]);

  return (
    <div>
      <Modal open={Props.open} onClose={Props.onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box sx={{ ...style }}>
          <ModalBody>
            <div className="modal-header">
              <div>프로필 이미지 편집</div>
              <CloseOutlinedIcon onClick={Props.onClose} />
            </div>
            <div className="modal-body">
              {src && (
                <ReactCrop src={src} crop={crop} ruleOfThirds onImageLoaded={onImageLoaded} onComplete={onCropComplete} onChange={onCropChange} />
              )}
              <PrevArea>
                미리보기
                <ModalImg id="crop" className="crop-img" src={cropSrc} />
              </PrevArea>
            </div>
            <div className="modal-footer">
              <Button onClick={onClickSave}>저장</Button>
            </div>
          </ModalBody>
        </Box>
      </Modal>
    </div>
  );
};

export default ImgCropModal;
