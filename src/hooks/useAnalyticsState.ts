import { Analytics } from "@/types/analytics";
import { useArtistFormStore } from "@/stores/artist-form-store";
import { parseCompactNumber } from "@/lib/utils/number-format";

export const useAnalyticsState = () => {
  const { dispatch, analytics } = useArtistFormStore();

  const formatNumber = (num: number | null | undefined) => {
    if (!num) return "N/A";
    return new Intl.NumberFormat("en-US", { notation: "compact" }).format(num).toString();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, field: keyof Analytics) => {
    const value = parseCompactNumber(e.target.value);
    if (value !== null) {
      dispatch({
        type: 'UPDATE_ANALYTICS',
        payload: { [field]: value }
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Analytics) => {        
    const value = parseCompactNumber(e.target.value);
    if (value !== null) {
      dispatch({
        type: 'UPDATE_ANALYTICS',
        payload: { [field]: value }
      });
    }
  };

  return {
    analytics,
    formatNumber,
    handleBlur,
    handleChange
  };
}; 