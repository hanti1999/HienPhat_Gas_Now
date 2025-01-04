import { RuleType } from '@/types/type';

const validationRules: RuleType[] = [
  {
    key: 'MIN_LENGTH',
    ruleValue: 8,
    label: 'Tối thiểu 8 ký tự',
  },
  {
    key: 'MAX_LENGTH',
    ruleValue: 20,
    label: 'Tối đa 20 ký tự',
  },
  { key: 'PASSWORDS_MATCH', label: 'Mật khẩu trùng khớp' },
];

export default validationRules;
