import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Building, Check, ArrowLeft, Clock, User, Globe } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  SupportedLanguage, 
  BookingResponse, 
  getTranslation,
  TranslationMessages
} from '@/lib/types';

interface PaymentFlowProps {
  bookingDetails: BookingResponse;
  onPaymentComplete: ()=> void;
  onBack: () => void;
  language: SupportedLanguage;
}

type PaymentStep = 'confirmation' | 'method-selection' | 'credit-card' | 'bank-transfer';

const PaymentFlow = ({ 
  bookingDetails,
  onPaymentComplete,
  onBack,
  language
}: PaymentFlowProps) => {
  const [step, setStep] = useState<PaymentStep>('confirmation');
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 使用你existing的翻譯系統
  const t = useCallback((key: keyof TranslationMessages, params?: Record<string, string | number>) => 
    getTranslation(language, key, params), [language]);

  const translations = {
    paymentDetails: {
      en: 'Payment Details',
      zh: '付款詳情',
      ja: 'お支払い詳細',
      ko: '결제 정보',
      es: 'Detalles del Pago',
      fr: 'Détails du Paiement'
    },
    creditCard: {
      en: 'Credit Card',
      zh: '信用卡',
      ja: 'クレジットカード',
      ko: '신용카드',
      es: 'Tarjeta de Crédito',
      fr: 'Carte de Crédit'
    },
    bankTransfer: {
      en: 'Bank Transfer',
      zh: '銀行轉帳',
      ja: '銀行振込',
      ko: '계좌이체',
      es: 'Transferencia Bancaria',
      fr: 'Virement Bancaire'
    },
    cardNumber: {
      en: 'Card Number',
      zh: '卡號',
      ja: 'カード番号',
      ko: '카드 번호',
      es: 'Número de Tarjeta',
      fr: 'Numéro de Carte'
    },
    expiryDate: {
      en: 'Expiry Date',
      zh: '有效期限',
      ja: '有効期限',
      ko: '만료일',
      es: 'Fecha de Vencimiento',
      fr: "Date d'Expiration"
    },
    cvv: {
      en: 'CVV',
      zh: '安全碼',
      ja: 'セキュリティコード',
      ko: '보안코드',
      es: 'Código de Seguridad',
      fr: 'Code de Sécurité'
    },
    testCard: {
      en: 'Test Card: 4242 4242 4242 4242',
      zh: '測試卡號：4242 4242 4242 4242',
      ja: 'テストカード：4242 4242 4242 4242',
      ko: '테스트 카드: 4242 4242 4242 4242',
      es: 'Tarjeta de prueba: 4242 4242 4242 4242',
      fr: 'Carte de test: 4242 4242 4242 4242'
    },
    confirmPayment: {
      en: 'Confirm Payment',
      zh: '確認付款',
      ja: '支払いを確認',
      ko: '결제 확인',
      es: 'Confirmar Pago',
      fr: 'Confirmer le Paiement'
    },
    processing: {
      en: 'Processing...',
      zh: '處理中...',
      ja: '処理中...',
      ko: '처리 중...',
      es: 'Procesando...',
      fr: 'Traitement...'
    },
    confirmDetails: {
      en: 'Booking Details',
      zh: '預約詳情',
      ja: '予約内容',
      ko: '예약 내용',
      es: 'Detalles de la reserva',
      fr: 'Détails de la réservation'
    },
    proceedToPayment: {
      en: 'Proceed to Payment',
      zh: '前往付款',
      ja: '支払いに進む',
      ko: '결제 진행',
      es: 'Proceder al pago',
      fr: 'Procéder au paiement'
    },
    teacher: {
      en: 'Teacher',
      zh: '老師',
      ja: '講師',
      ko: '선생님',
      es: 'Profesor',
      fr: 'Professeur'
    },
    dateTime: {
      en: 'Date & Time',
      zh: '日期和時間',
      ja: '日時',
      ko: '날짜 및 시간',
      es: 'Fecha y hora',
      fr: 'Date et heure'
    }
  } as const;

  const bankInfo = {
    accountNumber: '1234-5678-9012-3456',
    bankName: 'Test Bank',
    swiftCode: 'TESTXXXX'
  };

  const handlePaymentMethod = useCallback((method: PaymentStep) => {
    setStep(method);
  }, []);

  const handleCreditCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
  
    try {
      // 模擬付款處理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 呼叫父組件的 onPaymentComplete 來顯示預約成功
      await onPaymentComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBankTransferComplete = async () => {
    setIsProcessing(true);
    try {
      // 模擬銀行轉帳處理
      await new Promise(resolve => setTimeout(resolve, 2000));
      await onPaymentComplete(); // 等待完成回調
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToConfirmation = useCallback(() => {
    setStep('confirmation');
  }, []);

  const renderConfirmation = () => (
    <div className="space-y-6 ">
      <div className="space-y-4 ">
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
          <Clock className="text-pink-500" size={20} />
          <div>
            <div className="text-sm text-gray-500">{translations.dateTime[language]}</div>
            <div>{bookingDetails.lessonDateTime}</div>
          </div>
        </div>
  
        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
          <User className="text-pink-500" size={20} />
          <div>
            <div className="text-sm text-gray-500">{translations.teacher[language]}</div>
            <div>{bookingDetails.teacherName}</div>
          </div>
        </div>
      </div>
  
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Back
        </button>
        <button
          onClick={() => setStep('method-selection')}
          className="flex-1 px-4 py-2 bg-[#B48A84] text-white hover:bg-[#C69B9B] rounded-md "
        >
          {translations.proceedToPayment[language]}
        </button>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div className="space-y-4">
      <button
        onClick={() => handlePaymentMethod('credit-card')}
        className="w-full flex items-center gap-3 p-4 border bg-white rounded-lg hover:bg-[#D4B5B5]"
      >
        <CreditCard className="text-pink-500 " size={24} />
        <span>{translations.creditCard[language]}</span>
      </button>

      <button
        onClick={() => handlePaymentMethod('bank-transfer')}
        className="w-full flex items-center gap-3 p-4 border bg-white rounded-lg hover:bg-[#D4B5B5]"
      >
        <Building className="text-pink-500" size={24} />
        <span>{translations.bankTransfer[language]}</span>
      </button>
    </div>
  );

  const renderCreditCardForm = () => (
    <form onSubmit={handleCreditCardSubmit} className="space-y-4">
      {/* <div className="text-sm text-gray-500 mb-4">
        {translations.testCard[language]}
      </div> */}
  
      <div>
        <label className="block text-sm font-medium mb-1">
          {translations.cardNumber[language]}
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="4242 4242 4242 4242"
          maxLength={19}
          required
        />
      </div>
  
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            {translations.expiryDate[language]}
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="MM/YY"
            maxLength={5}
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">
            {translations.cvv[language]}
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="123"
            maxLength={3}
            required
          />
        </div>
      </div>
  
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full px-4 py-2 bg-[#B48A84] text-white hover:bg-[#C69B9B] rounded-md  disabled:opacity-50"
      >
        {isProcessing ? translations.processing[language] : translations.confirmPayment[language]}
      </button>
    </form>
  );

  const renderBankTransfer = () => (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
        <h3 className="font-medium mb-3">{translations.bankTransfer[language]}</h3>
        <div className="space-y-2">
          {Object.entries(bankInfo).map(([key, value]) => (
            <div key={key}>
              <div className="text-sm text-gray-500">{key}</div>
              <div className="font-medium">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleBankTransferComplete}
        className="w-full px-4 py-2 bg-[#B48A84] text-white hover:bg-[#C69B9B]  rounded-md"
        disabled={isProcessing}
      >
        {isProcessing ? translations.processing[language] : t('bookingConfirmed')}
      </button>
    </div>
  );

  return (
    <motion.div
      className="w-full max-w-md mx-auto bg-[#E3D1D1] dark:bg-zinc-900 rounded-lg shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-6">
        {step !== 'confirmation' && (
          <button 
            onClick={() => setStep('confirmation')} 
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h2 className="text-xl font-semibold">{translations.paymentDetails[language]}</h2>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {step === 'confirmation' && renderConfirmation()}
      {step === 'method-selection' && renderPaymentMethods()}
      {step === 'credit-card' && renderCreditCardForm()}
      {step === 'bank-transfer' && renderBankTransfer()}
    </motion.div>
  );
};

export default PaymentFlow;