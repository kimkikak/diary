import useDiary from "../hooks/useDiary";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/Button";
import Header from "../components/Header";
import { getFormattedDate } from "../utils";
import Viewer from "../components/Viewer";

const Diary = () => {
  const { id } = useParams();
  const data = useDiary(id);

  const goBack = () => {
    navigate(-1);
  };

  const goEdit = () => {
    navigate(`/edit/${id}`);
  };

  const navigate = useNavigate();

  if (!data) {
    return <div>일기를 불러오고 있습니다...</div>;
  } else {
    const { date, emotionId, content } = data;
    const title = `${getFormattedDate(new Date(Number(date)))} 기록`;
    return (
      <div>
        <Header
          title={title}
          leftChild={<Button text={"< 뒤로가기"} onClick={goBack} />}
          rightChild={<Button text={"수정하기"} onClick={goEdit} />}
        />
        <Viewer content={content} emotionId={emotionId} />
      </div>
    );
  }
};

export default Diary;
