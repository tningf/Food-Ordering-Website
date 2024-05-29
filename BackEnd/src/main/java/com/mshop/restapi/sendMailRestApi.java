package com.mshop.restapi;

import java.text.DecimalFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mshop.entity.Order;
import com.mshop.entity.OrderDetail;
import com.mshop.repository.OrderDetailRepository;
import com.mshop.repository.UserRepository;
import com.mshop.service.SendMailService;

import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfWriter;
import org.xhtmlrenderer.pdf.ITextRenderer;

@CrossOrigin("*")
@RestController
@RequestMapping("api/send-mail")
public class sendMailRestApi {

	@Autowired
	OrderDetailRepository ODrepo;

	@Autowired
	SendMailService sendMail;

	@Autowired
	UserRepository Urepo;

	@PostMapping("/order")
	public ResponseEntity<Void> sendMail(@RequestBody Order o) {
		if (o.getStatus() == 0) {
			sendMailCancelOrder(o, "Đơn hàng đã bị hũy!", "Đơn hàng của bạn đã huỷ !");
		} else if (o.getStatus() == 1) {
			sendMailOrder(o, "Chúc mừng đã đặt hàng thành công!", "Đơn hàng của bạn đã đặt hàng thành công!");
		} else if (o.getStatus() == 2) {
			sendMailOrder(o, "Đơn hàng của bạn đã được xác nhận!", "Đơn hàng của bạn đã được xác nhận thành công!");
		} else if (o.getStatus() == 3) {
			sendMailOrder(o, "Chúc mừng đã thanh toán thành công!", "Đơn hàng của bạn đã thanh toán thành công!");
		}

		return ResponseEntity.ok().build();
	}

	@PostMapping("/otp")
	public ResponseEntity<Integer> sendOpt(@RequestBody String email) {
		int random_otp = (int) Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
		if (Urepo.existsByEmail(email)) {
			return ResponseEntity.notFound().build();
		}
		sendMailOtp(email, random_otp, "Xác nhận tài khoản!");
		return ResponseEntity.ok(random_otp);
	}

	@PostMapping("/otp-forgot-password")
	public ResponseEntity<Integer> sendOpt1(@RequestBody String email) {
		int random_otp = (int) Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
		if (!Urepo.existsByEmail(email)) {
			return ResponseEntity.notFound().build();
		}
		sendMailOtp(email, random_otp, "Quên mật khẩu?");
		return ResponseEntity.ok(random_otp);
	}

	// format currency
	public String format(String number) {
		DecimalFormat formatter = new DecimalFormat("###,###,###.##");

		return formatter.format(Double.valueOf(number)) + " VNĐ";
	}

	// sendmail
	public void sendMailOtp(String email, int Otp, String title) {
		String body = "<div>\r\n"
				+ "        <h3>Mã OTP của bạn là: <span style=\"color:red; font-weight: bold;\">" + Otp
				+ "</span></h3>\r\n" + "    </div>";
		sendMail.queue(email, title, body);
	}

	// sendmail
	public void sendMailOrder(Order order, String subtitle, String title) {
		List<OrderDetail> list = ODrepo.findOrderDetailByOrderId(order.getId());

		StringBuilder content = new StringBuilder();

		content.append("<html>\r\n"
				+ "<head>\r\n"
				+ "<style>\r\n"
				+ "body { font-family: Arial, sans-serif; font-size: 14px; }\r\n"
				+ "table { border-collapse: collapse; width: 100%; }\r\n"
				+ "th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\r\n"
				+ "th { background-color: #f0f0f0; }\r\n"
				+ "</style>\r\n"
				+ "</head>\r\n"
				+ "<body>\r\n"
				+ "<p>Xin chào " + order.getUser().getName() + ",</p>\r\n"
				+ "<p>Thông tin đơn hàng.</p>\r\n"
				+ "<table>\r\n"
				+ "<tr><th>Số Hóa đơn</th><td>" + order.getId() + "</td></tr>\r\n"
				+ "<tr><th>Ngày tạo</th><td>" + order.getOrderDate() + "</td></tr>\r\n"
				+ "</table>\r\n"
				+ "<h3>Dưới đây là chi tiết đơn hàng của bạn:</h3>\r\n"
				+ "<table>\r\n"
				+ "<tr><th>Tên sản phẩm</th><th>Số lượng</th><th>Giá</th><th>Thành tiền</th></tr>\r\n");

		for (OrderDetail item : list) {
			content.append("<tr>\r\n"
					+ "<td>" + item.getProduct().getName() + "</td>\r\n"
					+ "<td>" + item.getQuantity() + "</td>\r\n"
					+ "<td>" + format(String.valueOf(item.getPrice())) + "</td>\r\n"
					+ "<td>" + format(String.valueOf(item.getPrice() * item.getQuantity())) + "</td>\r\n"
					+ "</tr>\r\n");
		}

		content.append("<tr><th colspan=\"3\">Tổng cộng</th><td>" + format(String.valueOf(order.getAmount())) + "</td></tr>\r\n"
				+ "</table>\r\n"
				+ "<p>Cảm ơn bạn đã mua hàng.</p>\r\n"
				+ "</body>\r\n"
				+ "</html>");

		sendMail.queue(order.getUser().getEmail(), subtitle, content.toString());
	}

	// sendmailCancelOrder
	public void sendMailCancelOrder(Order order, String subtitle, String title) {
		List<OrderDetail> list = ODrepo.findOrderDetailByOrderId(order.getId());

		StringBuilder content = new StringBuilder();

		content.append("<html>\r\n"
				+ "<head>\r\n"
				+ "<style>\r\n"
				+ "body { font-family: Arial, sans-serif; font-size: 14px; }\r\n"
				+ "table { border-collapse: collapse; width: 100%; }\r\n"
				+ "th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }\r\n"
				+ "th { background-color: #f0f0f0; }\r\n"
				+ "</style>\r\n"
				+ "</head>\r\n"
				+ "<body>\r\n"
				+ "<p>Xin chào " + order.getUser().getName() + ",</p>\r\n"
				+ "<p><span style='color:red; font-weight:bold; font-style:italic;'>Đơn hàng của bạn đã bị hủy.</span></p>\r\n"
				+ "<p>Thông tin đơn hàng.</p>\r\n"
				+ "<table>\r\n"
				+ "<tr><th>Mã đơn hàng</th><td>" + order.getId() + "</td></tr>\r\n"
				+ "<tr><th>Ngày tạo</th><td>" + order.getOrderDate() + "</td></tr>\r\n"
				+ "</table>\r\n"
				+ "<h3>Dưới đây là chi tiết đơn hàng của bạn:</h3>\r\n"
				+ "<table>\r\n"
				+ "<tr><th>Tên sản phẩm</th><th>Số lượng</th><th>Giá</th><th>Thành tiền</th></tr>\r\n");

		for (OrderDetail item : list) {
			content.append("<tr>\r\n"
					+ "<td>" + item.getProduct().getName() + "</td>\r\n"
					+ "<td>" + item.getQuantity() + "</td>\r\n"
					+ "<td>" + format(String.valueOf(item.getPrice())) + "</td>\r\n"
					+ "<td>" + format(String.valueOf(item.getPrice() * item.getQuantity())) + "</td>\r\n"
					+ "</tr>\r\n");
		}

		content.append("<tr><th colspan=\"3\">Tổng cộng</th><td>" + format(String.valueOf(order.getAmount())) + "</td></tr>\r\n"
				+ "</table>\r\n"
				+ "</body>\r\n"
				+ "</html>");

		sendMail.queue(order.getUser().getEmail(), subtitle, content.toString());
	}
}