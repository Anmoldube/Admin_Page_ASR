import { createContext, useContext, useState, ReactNode } from "react";

export type Vertical = "charter" | "air-ambulance" | "air-taxi";
export type UserRole = "admin" | "operator";

interface AdminContextType {
  currentVertical: Vertical;
  setCurrentVertical: (vertical: Vertical) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [currentVertical, setCurrentVertical] = useState<Vertical>("charter");
  const [userRole, setUserRole] = useState<UserRole>("admin");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AdminContext.Provider
      value={{
        currentVertical,
        setCurrentVertical,
        userRole,
        setUserRole,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};