import React from 'react';
import { useAuthConfig } from '../../../hooks/useAuthConfig';
import { useLocalization } from '../../../hooks/useLocalization';
import { LoginMethod, AuthElement } from '../../../types';
import Icon from '../../../components/Icon';
import CloseButton from '../../../components/CloseButton';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { authConfig, setAuthConfig } = useAuthConfig();
  const { t } = useLocalization();

  const handleMethodChange = (method: LoginMethod) => {
    const newMethods = authConfig.enabledMethods.includes(method)
      ? authConfig.enabledMethods.filter((m) => m !== method)
      : [...authConfig.enabledMethods, method];
    setAuthConfig({ ...authConfig, enabledMethods: newMethods });
  };

  const handleElementChange = (element: AuthElement) => {
    const newElements = authConfig.visibleElements.includes(element)
      ? authConfig.visibleElements.filter((e) => e !== element)
      : [...authConfig.visibleElements, element];
    setAuthConfig({ ...authConfig, visibleElements: newElements });
  };

  const handleColorChange = (key: keyof typeof authConfig.colorScheme, value: string) => {
    setAuthConfig({
      ...authConfig,
      colorScheme: { ...authConfig.colorScheme, [key]: value },
    });
  };

  const handleCssChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAuthConfig({ ...authConfig, customCSS: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-sm h-full bg-white dark:bg-gray-800 shadow-2xl p-6 overflow-y-auto text-gray-800 dark:text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t('admin.title')}</h2>
          <CloseButton onClick={onClose} className="text-[6px]" />
        </div>

        <div className="space-y-6">
          {/* Enabled Methods */}
          <div>
            <h3 className="font-semibold mb-2">{t('admin.enabled_methods')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['email', 'phone', 'google', 'facebook', 'twitter', 'apple', 'github'] as LoginMethod[]).map((method) => (
                <label key={method} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={authConfig.enabledMethods.includes(method)}
                    onChange={() => handleMethodChange(method)}
                    className="rounded text-indigo-500 focus:ring-indigo-500"
                  />
                  <span>{method.charAt(0).toUpperCase() + method.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Visible Elements */}
          <div>
            <h3 className="font-semibold mb-2">{t('admin.visible_elements')}</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['rememberMe', 'forgotPassword', 'socialDivider', 'termsCheckbox', 'countrySelector'] as AuthElement[]).map((el) => (
                <label key={el} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={authConfig.visibleElements.includes(el)}
                    onChange={() => handleElementChange(el)}
                    className="rounded text-indigo-500 focus:ring-indigo-500"
                  />
                  <span>{el}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <h3 className="font-semibold mb-2">{t('admin.color_scheme')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(authConfig.colorScheme).map(([key, value]) => (
                <div key={key}>
                  <label htmlFor={key} className="text-sm capitalize">{t(`admin.${key}`)}</label>
                  <input
                    id={key}
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof typeof authConfig.colorScheme, e.target.value)}
                    className="w-full h-8 mt-1 p-0 border-none rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Custom CSS */}
          <div>
            <h3 className="font-semibold mb-2">{t('admin.custom_css')}</h3>
            <textarea
              value={authConfig.customCSS}
              onChange={handleCssChange}
              rows={5}
              className="w-full p-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder=".auth-container { border-radius: 20px; }"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;