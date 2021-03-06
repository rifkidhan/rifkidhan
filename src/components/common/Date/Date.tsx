import { FC } from "react";
import { parseISO, format } from "date-fns";

interface Props {
  dateString: string;
}

const Date: FC<Props> = ({ dateString }) => {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, "cccc, d LLLL yyyy")}</time>;
};

export default Date;
