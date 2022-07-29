import React, {
  createContext,
  FC,
  useState,
  useContext,
  useEffect,
} from 'react';
import { Mail } from 'renderer/types';

export type MainContextType = {
  mails: Mail[];
  setState: React.Dispatch<
    React.SetStateAction<Omit<MainContextType, 'setState'>>
  >;
};

export const defaultContext: MainContextType = {
  mails: [],
  setState: () => {},
};

const MainContext = createContext<MainContextType>(defaultContext);
const MainContextProvider = MainContext.Provider;

export type ProviderPRops = {
  children: React.ReactNode | React.ReactNode[];
};
export const Provider: FC<ProviderPRops> = ({ children }) => {
  const [state, setState] =
    useState<Omit<MainContextType, 'setState'>>(defaultContext);
  useEffect(() => {
    sessionStorage.setItem('context', JSON.stringify(state));
  }, [state]);
  return (
    <MainContextProvider value={{ ...state, setState }}>
      {children}
    </MainContextProvider>
  );
};

export const useMainContext = () => {
  const context = useContext(MainContext);
  return context;
};

export default MainContext;
