import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Edit from "./pages/Edit";
import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  DiaryStateContext,
  DiaryDispatchContext,
} from "../context/DiaryContext";

function reducer(state, action) {
  switch (action.type) {
    case "CREATE": {
      //return [action.data, ...state];
      const newState = [action.data, ...state];
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "UPDATE": {
      //return state.map((it) =>
      //  String(it.id) === String(action.data.id) ? { ...action.data } : it
      //);
      const newState = state.map((it) =>
        String(it.id) === String(action.data.id) ? { ...action.data } : it
      );
      localStorage.setItem("diary", JSON.stringify(newState));
      return newState;
    }
    case "DELETE": {
      return state.filter((it) => String(it.id) !== String(action.targetId));
    }
    case "INIT": {
      return action.data;
    }
    default: {
      return state;
    }
  }
}

// const mockData = [
//   {
//     id: "0",
//     date: new Date().getTime() - 1,
//     content: "mock1",
//     emotionId: 1,
//   },
//   {
//     id: "1",
//     date: new Date().getTime() - 2,
//     content: "mock2",
//     emotionId: 2,
//   },
//   {
//     id: "2",
//     date: new Date().getTime() - 3,
//     content: "mock3",
//     emotionId: 3,
//   },
// ];

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(3);

  useEffect(() => {
    // dispatch({
    //   type: "INIT",
    //   data: mockData,
    // });
    // setIsDataLoaded(true);
    const rawData = localStorage.getItem("diary");
    const localData = JSON.parse(rawData);

    if (localData.length === 0) {
      setIsDataLoaded(true);
      return;
    }

    localData.sort((a, b) => Number(b.id) - Number(a.id));
    idRef.current = localData[0].id;

    dispatch({ type: "INIT", data: localData });
    setIsDataLoaded(true);
  }, []);

  const onCreate = (date, content, emotionId) => {
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current,
        date: new Date(date).getTime(),
        content,
        emotionId,
      },
    });
    idRef.current += 1;
  };

  const onUpdate = (targetId, date, content, emotionId) => {
    dispatch({
      type: "UPDATE",
      data: {
        id: targetId,
        date: new Date(date).getTime(),
        content,
        emotionId,
      },
    });
  };

  const onDelete = (targetId) => {
    dispatch({
      type: "DELETE",
      targetId,
    });
  };

  if (!isDataLoaded) {
    return <div>데이터를 불러오는 중입니다.</div>;
  } else {
    return (
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider
          value={{
            onCreate,
            onUpdate,
            onDelete,
          }}
        >
          <div className="App">
            <h1>감정 일기장</h1>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/diary/:id" element={<Diary />} />
              <Route path="/new" element={<New />} />
              <Route path="/edit/:id" element={<Edit />} />
            </Routes>
          </div>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    );
  }
}

export default App;
