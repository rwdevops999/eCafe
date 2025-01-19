import { useTheme } from 'next-themes'
import ThemeSun from '../ecafe/theme-sun';
import ThemeMoon from '../ecafe/theme-moon';

const ToolsTheme = () => {
    const { theme, setTheme } = useTheme();

    const renderComponent = () => {
        return (
            <div className="flex justify-center ml-3">
                <input
                    type="checkbox"
                    name="light-switch"
                    className="light-switch"
                    checked={theme === 'dark'}
                    onChange={() => {
                    if (theme === 'dark') {
                        return setTheme('light')
                    }
                    return setTheme('dark')
                    }}
                />
                <label className="relative ml-2" htmlFor="light-switch">
                    <ThemeMoon />
                    <ThemeSun />
                </label>
            </div>
        );
    };

  return (<>{renderComponent()}</>);
}

export default ToolsTheme;