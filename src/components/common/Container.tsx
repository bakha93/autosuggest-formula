export const Container = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
  return <div className="full flex justify-center p-20">{children}</div>;
};
