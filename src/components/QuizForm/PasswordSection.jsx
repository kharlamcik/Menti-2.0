// PasswordSection.jsx
import Button from "@/components/Button";

const PasswordSection = ({ password, onPasswordChange, onConnect }) => {
  return (
    <div className="mb-10 rounded-3xl bg-white p-8 shadow-md">
      <h2 className="mb-5 text-2xl font-semibold">Пароль викторины</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value.toUpperCase())}
          placeholder="Например: ABC123"
          className="flex-1 rounded-2xl border border-gray-300 px-6 py-4 text-lg font-mono focus:border-indigo-500 focus:outline-none"
        />
        <Button 
          onClick={onConnect} 
          className="bg-indigo-600 hover:bg-indigo-700 px-10 py-4 text-lg whitespace-nowrap"
        >
          Подключиться
        </Button>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        Если викторина существует — она загрузится. Если нет — будет создана новая.
      </p>
    </div>
  );
};

export default PasswordSection;