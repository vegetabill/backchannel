import React from "react";

const AppContext = React.createContext();
AppContext.displayName = "AppContext";

export const Provider = AppContext.Provider;
// export const Consumer = AppContext.Consumer;

export default AppContext;
