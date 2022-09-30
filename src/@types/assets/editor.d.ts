import "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    setSize: {
      /**
       * set image size
       */
      setSize: (options: { size: string }) => ReturnType;
    };
    setTextBgColor: {
      /**
       * set text bg color
       */
      setTextBgColor: (options: { backgroundColor: string }) => ReturnType;
    };
  }
}

// import "swiper";

// declare module "swiper" {

// }