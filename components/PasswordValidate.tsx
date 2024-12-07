import { ImageStyle, ViewStyle, StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, View, TextStyle } from 'react-native';
import { getDefaultRuleLabel, getValidation } from '@/types/passwordValidate';
import { checkValidationRules, debounce } from '@/types/passwordValidate';
import { AntDesign } from '@expo/vector-icons';
import { RuleType } from '@/types/type';

type Props = {
  newPassword: string;
  confirmPassword: string;
  onPasswordValidateChange: (data: boolean) => void;
  validationRules: Array<RuleType>;
  iconSuccessSource?: any;
  iconErrorSource?: any;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconStyle?: ImageStyle;
};

type CustomRuleType = RuleType & { validation: boolean; label: string };

const PasswordValidate: React.FC<Props> = ({
  newPassword,
  confirmPassword,
  onPasswordValidateChange,
  validationRules,
  iconSuccessSource = 'check',
  iconErrorSource = 'close',
  containerStyle = {},
  labelStyle = {},
  iconStyle = {},
}) => {
  const [rulesList, setRulesList] = useState<Array<CustomRuleType>>([]);

  const validatePasswords = (list: Array<CustomRuleType>) => {
    //  check if any field is false
    const allSuccess =
      list.some((object) => object.validation === false) === false;

    onPasswordValidateChange(allSuccess);
  };

  const debounceValidationCheckFunc = useCallback(
    debounce(validatePasswords),
    []
  );

  useEffect(() => {
    if (checkValidationRules(validationRules)) {
      setFieldsList();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPassword, confirmPassword, validationRules]);

  const setFieldsList = () => {
    const list: Array<CustomRuleType> = [];

    validationRules.forEach((rule) => {
      const object = {
        ...rule,
        validation: getValidation(rule, newPassword, confirmPassword),
        label: rule.label || getDefaultRuleLabel(rule.key, rule.ruleValue || 0),
      };

      list.push(object);
    });

    setRulesList(list);

    debounceValidationCheckFunc(list);
  };

  const renderItem = ({ item }: { item: CustomRuleType }) => (
    <View style={styles.field}>
      {item.validation ? (
        <AntDesign name={iconSuccessSource} size={16} color={'#66ff66'} />
      ) : (
        <AntDesign name={iconErrorSource} size={16} color={'#ff0000'} />
      )}

      <Text style={[styles.label, labelStyle]}>{item.label}</Text>
    </View>
  );

  const keyExtractor = (item: any, index: number) => `${index}`;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      <FlatList
        data={rulesList}
        scrollEnabled={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default PasswordValidate;

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    marginHorizontal: 5,
  },
  icon: {
    marginRight: 5,
    width: 24,
    height: 24,
  },
  label: {
    flexShrink: 1,
  },
});
