import React from 'react';

interface ClassicInfoProps {
  onOpenDevModal: () => void;
}

export const ClassicInfo: React.FC<ClassicInfoProps> = ({ onOpenDevModal }) => {
  return (
    <footer className="info">
      <p>Düzenlemek için göreve çift tıklayın (Double-click to edit a todo)</p>
      <p>
        Geliştirici: {' '}
        <button
          onClick={onOpenDevModal}
          className="text-amber-800 font-semibold underline hover:text-amber-900 cursor-pointer"
          style={{ textDecoration: 'underline', font: 'inherit', color: 'inherit' }}
        >
          Enes Öztürk
        </button>
      </p>
      <p>
        <a href="https://www.patika.dev" target="_blank" rel="noopener noreferrer">
          Patika.dev React Bootcamp
        </a>{' '}
        · Ödev 2 ·{' '}
        <a href="https://todomvc.com" target="_blank" rel="noopener noreferrer">
          TodoMVC
        </a>
      </p>
    </footer>
  );
};
