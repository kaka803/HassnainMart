import nodemailer from 'nodemailer';

export async function OrderEmail({ to, shippingAddress, products, subtotal, shippingFee, total, isAdmin = false }) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const title = isAdmin ? "🛒 New Order Received" : "🛒 Order Confirmation";
  const greeting = isAdmin
    ? `<p>You have received a new order from <strong>${shippingAddress.firstName}</strong>.</p>`
    : `<p>Hi <strong>${shippingAddress.firstName}</strong>,</p><p>We have received your order. Here's a summary:</p>`;

  const mailOptions = {
    from: `"MyStore Orders" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; font-size: 16px; line-height: 1.6;">
        <h2 style="color: #db4444;">${title}</h2>
        ${greeting}

        <h3>🧾 Order Summary:</h3>
        <ul>
          ${products
            .map(
              (p) => `
            <li>
              <strong>${p.name}</strong> - Qty: ${p.quantity}, Color: ${p.selectedColor}, Size: ${p.selectedSize}<br/>
              Price: $${p.price} x ${p.quantity} = <strong>$${p.price * p.quantity}</strong>
            </li>
          `
            )
            .join('')}
        </ul>

        <p><strong>Subtotal:</strong> $${subtotal}</p>
        <p><strong>Shipping:</strong> ${shippingFee === 0 ? 'Free' : `$${shippingFee}`}</p>
        <p><strong>Total:</strong> <span style="color: green; font-size: 18px;">Rs.${total}</span></p>

        <h3>📦 Shipping Details:</h3>
        <p>
          ${shippingAddress.streetAddress}, ${shippingAddress.apartment || ''}<br/>
          ${shippingAddress.city}<br/>
          Phone: ${shippingAddress.phone}<br/>
          Email: ${shippingAddress.email}
        </p>

        <p style="margin-top: 30px;">Thank you!</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
