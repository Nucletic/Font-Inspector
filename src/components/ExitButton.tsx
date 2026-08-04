function ExitButton({ onExitPress }: { onExitPress: () => void }) {
  return (
    <button onClick={onExitPress} className="exit-button">
      <p>
        Exit Font Inspector <kbd>Esc</kbd>
      </p>
    </button>
  );
}

export default ExitButton;
