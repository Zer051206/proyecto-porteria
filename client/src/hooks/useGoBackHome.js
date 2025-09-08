import { useNavigate } from 'react-router-dom';

export const useGoBack = (path = '/') => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(path);
  };

  return goBack;
};