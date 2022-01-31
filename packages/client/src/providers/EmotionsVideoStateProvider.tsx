import React, { useState } from "react";

interface IEmotionsVideoState {
  emotion: string | null;
}

interface IEmotionsVideoStateContext {
  emotionsVideoState: IEmotionsVideoState;
  setEmotion(emotion: string): void;
}

const EmotionsVideoStateContext =
  React.createContext<IEmotionsVideoStateContext>(null!);

export const EmotionsVideoStateProvider: React.FC = ({ children }) => {
  const [emotionsVideoState, setEmotionsVideoState] =
    useState<IEmotionsVideoState>({ emotion: null });

  const setEmotion = (emotion: string) => {
    setEmotionsVideoState({ emotion });
  };

  return (
    <EmotionsVideoStateContext.Provider
      value={{ emotionsVideoState, setEmotion }}
    >
      {children}
    </EmotionsVideoStateContext.Provider>
  );
};

export const useEmotionsVideoState = () =>
  React.useContext(EmotionsVideoStateContext);
