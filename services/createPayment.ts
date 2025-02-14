import { generateSignature } from '@crypto/secret';
import { Config, PaymentResponse, PaymentParams } from '@services/types/payments';
import { validateNumber } from '@utils/validate'

export const createPayment = async (
    config: Config,
    paymentData: PaymentParams
): Promise<PaymentResponse> => {
  if (!config.apiKey || !config.secretKey || !config.apiUrl) {
    throw new Error('Missing required configuration parameters');
  }

  validateNumber(paymentData.amount)

  try {
    const params: Record<string, string> = {
        apiKey: config.apiKey,
        commerceOrder: paymentData.commerceOrder,
        subject: paymentData.subject,
        currency: paymentData.currency,
        amount: validateNumber(paymentData.amount),
        email: paymentData.email,
        urlConfirmation: paymentData.urlConfirmation,
        urlReturn: paymentData.urlReturn
    };

    const signature = await generateSignature(params, config.secretKey);

    const url = new URL(`${config.apiUrl}/payment/create`);
    const body = new URLSearchParams({
        ...params,
        s: signature
    }).toString();

    const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Flow API error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();

    const res = {
        url: `${data.url}?token=${data.token}`,
        flowOrder: data.flowOrder
    }

    return {
        success: true,
        data: res
    };
  } catch (error) {
    return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};