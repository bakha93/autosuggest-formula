import "./App.css";
import { Container } from "@/components/common/Container.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { AutoCompleteFormula } from "@/components/AutoCompleteFormula";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <div className='text-sm items-start text-start'>
            <div className='text-gray-600'>Examples:</div>
            <div className='text-gray-600'>SUM(name 1, name 2)</div>
            <div className='text-gray-600'>AVERAGE(name 1, name 2) + SUM(name 20, name 4)</div>
            <div className='text-gray-600'>Press enter to see result</div>
        </div>
      <Container>
        <AutoCompleteFormula />
      </Container>
    </QueryClientProvider>
  );
}

export default App;
