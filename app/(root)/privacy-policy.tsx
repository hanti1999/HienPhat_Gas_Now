import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import ScreenHeader from '@/components/ScreenHeader';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView edges={['top']} className='flex-1 bg-primary-pink'>
      <StatusBar backgroundColor='#fb77c5' style='light' />
      <ScreenHeader text={'Chính sách bảo mật'} />
      <ScrollView className='bg-gray-100 flex-1'>
        <View className='p-3 bg-white flex-1 pb-10'>
          <Text style={styles.headerText}>
            1. Thông tin chúng tôi thu thập:
          </Text>
          <Text style={styles.textContent}>
            Thông tin cá nhân:{'\n'}- Họ và tên.{'\n'}- Số điện thoại.{'\n'}-
            Địa chỉ giao hàng.
          </Text>

          <Text style={styles.headerText}>2. Mục đích thu thập thông tin:</Text>
          <Text style={styles.textContent}>
            - Xử lý đơn hàng và giao hàng.{'\n'}- Cung cấp dịch vụ hỗ trợ khách
            hàng.{'\n'}- Gửi thông tin khuyến mãi và cập nhật sản phẩm.{'\n'}-
            Cải thiện trải nghiệm người dùng.{'\n'}- Phân tích xu hướng thị
            trường.
            {'\n'}- Tuân thủ quy định pháp luật.
          </Text>

          <Text style={styles.headerText}>
            3. Cách thức thu thập và lưu trữ thông tin:
          </Text>
          <Text style={styles.textContent}>
            - Thu thập thông tin khi người dùng đăng ký tài khoản, đặt hàng hoặc
            liên hệ với chúng tôi.{'\n'}- Lưu trữ thông tin trên máy chủ an toàn
            với các biện pháp bảo mật phù hợp.{'\n'}- Sử dụng các phương thức mã
            hóa dữ liệu.
          </Text>

          <Text style={styles.headerText}>
            4. Việc chia sẻ thông tin với bên thứ ba:
          </Text>
          <Text style={styles.textContent}>
            - Chia sẻ thông tin với các đối tác vận chuyển để giao hàng.{'\n'}-
            Không chia sẻ thông tin cá nhân với bên thứ ba cho mục đích tiếp thị
            mà không có sự đồng ý của người dùng.{'\n'}- Tuân thủ theo yêu cầu
            của cơ quan pháp luật có thẩm quyền.
          </Text>

          <Text style={styles.headerText}>5. Quyền của người dùng:</Text>
          <Text style={styles.textContent}>
            - Người dùng có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân
            của mình.{'\n'}- Người dùng có quyền từ chối nhận thông tin khuyến
            mãi.
            {'\n'}- Người dùng có quyền khiếu nại về việc xử lý thông tin cá
            nhân.
            {'\n'}- Liên hệ với chúng tôi qua thông tin liên hệ được cung cấp ở
            phần cuối của chính sách này.
          </Text>

          <Text style={styles.headerText}>6. Thay đổi chính sách bảo mật:</Text>
          <Text style={styles.textContent}>
            - Chúng tôi có quyền thay đổi chính sách bảo mật này vào bất kỳ lúc
            nào.{'\n'}- Chúng tôi sẽ thông báo cho người dùng về những thay đổi
            quan trọng.{'\n'}- Người sử dụng có trách nhiệm thường xuyên xem lại
            chính sách này để cập nhật các thay đổi.
          </Text>

          <Text style={styles.headerText}>7. Thông tin liên hệ:</Text>
          <Text style={styles.textContent}>
            - Tên công ty: CÔNG TY TNHH HIỀN PHÁT VI NA.{'\n'}- Địa chỉ: Quốc lộ
            51, khu 2, ấp 7, Xã An Phước, Huyện Long Thành, Tỉnh Đồng Nai, Việt
            Nam.{'\n'}- Email: gashienphat1979@gmail.com{'\n'}- Số điện thoại:{' '}
            <Link className='underline text-blue-500' href={'tel: 0965266926'}>
              0965 266926
            </Link>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    fontWeight: 600,
  },
  textContent: {
    fontSize: 16,
    marginTop: 8,
  },
});

export default PrivacyPolicy;
