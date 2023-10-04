import { createRoot } from 'react-dom/client';

function App() {
  return <div class="h-screen flex items-center justify-center">
    <div>

      <p class="text-slate-900 dark:text-white text-base font-medium tracking-tight">
        Tic Tac Toe
      </p>

      <div class="ring m-5 p-5 rounded-lg">
        playground
      </div>

      <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm">
        The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer space.
      </p>

    </div>
  </div>;
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
