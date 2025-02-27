'use client';

import { createContext, useContext, useReducer, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { ClinicSetupSchema } from "../types/schema";

interface SetupState {
  isPreSetupDone: boolean;
  currentStep: keyof ClinicSetupSchema | 'pre_setup';
  jsonSchema: Partial<ClinicSetupSchema>;
  email: string;
}

type SetupAction =
  | { type: "SET_PRE_SETUP_DONE" }
  | { type: "SET_JSON_SCHEMA"; payload: Partial<ClinicSetupSchema> | string }
  | { type: "UPDATE_JSON_SCHEMA"; payload: Partial<ClinicSetupSchema> } 
  | { type: "SET_CURRENT_STEP"; payload: SetupState['currentStep'] }
  | { type: "SET_EMAIL"; payload: string }
  | { type: "RESET_STATE" };

const initialState: SetupState = {
  isPreSetupDone: false,
  currentStep: "pre_setup",
  jsonSchema: {},
  email: ""
};

const setupReducer = (state: SetupState, action: SetupAction): SetupState => {
  switch (action.type) {
    case "SET_PRE_SETUP_DONE":
      return { ...state, isPreSetupDone: true };
      
    case "SET_JSON_SCHEMA":
      try {
        const parsedSchema = typeof action.payload === "string" 
          ? JSON.parse(action.payload) as Partial<ClinicSetupSchema>
          : action.payload;
        return { ...state, jsonSchema: parsedSchema };
      } catch (error) {
        console.error("Error parsing JSON Schema:", error);
        return state;
      }
      
    case "UPDATE_JSON_SCHEMA":
      return { 
        ...state, 
        jsonSchema: { 
          ...state.jsonSchema, 
          ...action.payload 
        } 
      };
      
    case "SET_CURRENT_STEP":
      return { ...state, currentStep: action.payload };
      
    case "SET_EMAIL":
      return { ...state, email: action.payload };
      
    case "RESET_STATE":
      return initialState;
      
    default:
      return state;
  }
};

interface SetupContextType {
  state: SetupState;
  dispatch: React.Dispatch<SetupAction>;
  setStep: (step: SetupState['currentStep']) => void;
  updateSchema: (data: Partial<ClinicSetupSchema>) => void;
  completePreSetup: (initialData: Partial<ClinicSetupSchema>) => void;
  getStepData: <K extends keyof ClinicSetupSchema>(step: K) => ClinicSetupSchema[K] | undefined;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export const SetupProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(setupReducer, initialState);
  
  const setStep = useCallback((step: SetupState['currentStep']) => {
    dispatch({ type: "SET_CURRENT_STEP", payload: step });
  }, []);
  
  const updateSchema = useCallback((data: Partial<ClinicSetupSchema>) => {
    dispatch({ type: "UPDATE_JSON_SCHEMA", payload: data });
  }, []);
  
  const completePreSetup = useCallback((initialData: Partial<ClinicSetupSchema> = {}) => {
    dispatch({ type: "SET_JSON_SCHEMA", payload: initialData });
    dispatch({ type: "SET_PRE_SETUP_DONE" });
    dispatch({ type: "SET_CURRENT_STEP", payload: "business_information" });
  }, []);
  
  const getStepData = useCallback(<K extends keyof ClinicSetupSchema>(step: K) => {
    return state.jsonSchema[step];
  }, [state.jsonSchema]);
  
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    setStep,
    updateSchema,
    completePreSetup,
    getStepData
  }), [state, setStep, updateSchema, completePreSetup, getStepData]);

  return (
    <SetupContext.Provider value={contextValue}>
      {children}
    </SetupContext.Provider>
  );
};

export const useSetup = () => {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error("useSetup must be used within a SetupProvider");
  }
  return context;
};

export const useStepData = <K extends keyof ClinicSetupSchema>(step: K) => {
  const { state, updateSchema } = useSetup();
  
  const stepData = state.jsonSchema[step];
  
  const updateStepData = useCallback((newData: Partial<ClinicSetupSchema[K]>) => {
    updateSchema({ [step]: { ...stepData, ...newData } } as Partial<ClinicSetupSchema>);
  }, [stepData, step, updateSchema]);
  
  return { 
    data: stepData, 
    updateData: updateStepData,
    isCurrentStep: state.currentStep === step
  };
}; 