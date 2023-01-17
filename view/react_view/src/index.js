import { createRoot } from 'react-dom/client';
import App from './App';

// // Before
// import ReactDOM from 'react-dom';
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // Before
// import { render } from 'react-dom';
// const container = document.getElementById('root');
// render(<App tab="home" />, container);

// After
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);