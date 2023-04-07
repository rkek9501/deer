import moment from "moment";
import { useEffect, useState } from "react";

const useDate = (originDate: string) => {
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const _date = moment(originDate).format("MMM DD, YYYY");
    setDate(_date);
  }, []);

  return date;
};

export default useDate;
