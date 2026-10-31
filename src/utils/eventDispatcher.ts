/**
 * Cranes ERP Unified Event Dispatcher
 * قناة الأحداث الموحدة لمنظومة أسطول الأوناش
 * 
 * يتيح لكافة الموديولات (الشيكات، الفواتير، العقود، التشغيل، السلامة)
 * إصدار أحداث واشتراك الموديولات الأخرى (مثل محرك واتساب والتدقيق)
 * دون وجود أي اقتران مباشر (Decoupled Event-Driven Architecture)
 */

export type CranesEventType =
  | 'cheque.received'
  | 'cheque.due_soon'
  | 'cheque.deposited'
  | 'cheque.collected'
  | 'cheque.returned'
  | 'cheque.cancelled'
  | 'invoice.submitted'
  | 'invoice.paid'
  | 'usage_log.pending_approval'
  | 'usage_log.approved'
  | 'contract.approved'
  | 'lead.created'
  | 'maintenance.due'
  | 'cert.expiring'
  | 'safety.incident'
  | 'supplier.payment_issued';

export interface CranesEventPayload {
  eventId: string;
  eventType: CranesEventType;
  timestamp: string;
  sourceModule: string;
  docType: string;
  docId: string;
  docNumber: string;
  partyNameAr?: string;
  partyPhone?: string;
  amount?: number;
  currency?: string;
  dueDate?: string;
  data: Record<string, any>;
}

type EventListener = (payload: CranesEventPayload) => void;

class CranesEventDispatcher {
  private listeners: Map<CranesEventType | '*', Set<EventListener>> = new Map();
  private eventHistory: CranesEventPayload[] = [];

  constructor() {
    this.initDefaultHistory();
  }

  private initDefaultHistory() {
    // Seed initial event history for dashboard awareness
    const now = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} 09:30:00`;

    this.eventHistory = [
      {
        eventId: 'evt-101',
        eventType: 'cheque.received',
        timestamp: timeStr,
        sourceModule: 'Multi-Cheque Management',
        docType: 'Cheque Batch',
        docId: 'cb-01',
        docNumber: 'BCH-2026-0041',
        partyNameAr: 'شركة بتروبل للغاز الطبيعي',
        partyPhone: '+201001234567',
        amount: 820000,
        currency: 'EGP',
        dueDate: '2026-11-20',
        data: { chequeCount: 2, allocationRule: 'FIFO' },
      },
      {
        eventId: 'evt-102',
        eventType: 'cheque.due_soon',
        timestamp: timeStr,
        sourceModule: 'Multi-Cheque Management',
        docType: 'Cheque',
        docId: 'chq-1',
        docNumber: 'CHQ-882190',
        partyNameAr: 'شركة أوراسكوم للإنشاءات',
        partyPhone: '+201009876543',
        amount: 350000,
        currency: 'EGP',
        dueDate: '2026-11-05',
        data: { warningDays: 5, status: 'Under Collection' },
      },
      {
        eventId: 'evt-103',
        eventType: 'invoice.submitted',
        timestamp: timeStr,
        sourceModule: 'Selling & Invoicing',
        docType: 'Sales Invoice',
        docId: 'inv-1',
        docNumber: 'ACC-SINV-2026-0001',
        partyNameAr: 'شركة بتروبل للغاز (حقل ظهر)',
        partyPhone: '+201001234567',
        amount: 877800,
        currency: 'EGP',
        dueDate: '2026-08-25',
        data: { hourlyRentalHours: 120, craneCode: 'EC-500-04' },
      },
    ];
  }

  /**
   * Subscribe to a specific event or all events (*)
   */
  public subscribe(eventType: CranesEventType | '*', listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    // Return unsubscribe function
    return () => {
      const set = this.listeners.get(eventType);
      if (set) {
        set.delete(listener);
      }
    };
  }

  /**
   * Publish an event to all subscribers (supports object payload or positional args)
   */
  public publish(
    eventOrType: CranesEventType | (Partial<CranesEventPayload> & { eventType: CranesEventType }),
    sourceModule?: string,
    docType?: string,
    docId?: string,
    docNumber?: string,
    data: Record<string, any> = {},
    extra: {
      partyNameAr?: string;
      partyPhone?: string;
      amount?: number;
      currency?: string;
      dueDate?: string;
    } = {}
  ): CranesEventPayload {
    const now = new Date();
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    let payload: CranesEventPayload;

    if (typeof eventOrType === 'object') {
      payload = {
        eventId: eventOrType.eventId || `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        eventType: eventOrType.eventType,
        timestamp: eventOrType.timestamp || timestamp,
        sourceModule: eventOrType.sourceModule || 'Core ERP',
        docType: eventOrType.docType || 'Document',
        docId: eventOrType.docId || 'DOC-01',
        docNumber: eventOrType.docNumber || 'DOC-01',
        partyNameAr: eventOrType.partyNameAr,
        partyPhone: eventOrType.partyPhone,
        amount: eventOrType.amount,
        currency: eventOrType.currency || 'EGP',
        dueDate: eventOrType.dueDate,
        data: eventOrType.data || {},
      };
    } else {
      payload = {
        eventId: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        eventType: eventOrType,
        timestamp,
        sourceModule: sourceModule || 'Core ERP',
        docType: docType || 'Document',
        docId: docId || 'DOC-01',
        docNumber: docNumber || 'DOC-01',
        partyNameAr: extra.partyNameAr,
        partyPhone: extra.partyPhone,
        amount: extra.amount,
        currency: extra.currency || 'EGP',
        dueDate: extra.dueDate,
        data,
      };
    }

    // Store in history (max 100 recent events)
    this.eventHistory.unshift(payload);
    if (this.eventHistory.length > 100) {
      this.eventHistory.pop();
    }

    // Notify specific listeners
    const specificListeners = this.listeners.get(payload.eventType);
    if (specificListeners) {
      specificListeners.forEach((listener) => {
        try {
          listener(payload);
        } catch (err) {
          console.error(`[EventDispatcher] Error in listener for ${payload.eventType}:`, err);
        }
      });
    }

    // Notify wildcard (*) listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach((listener) => {
        try {
          listener(payload);
        } catch (err) {
          console.error(`[EventDispatcher] Error in wildcard listener for ${payload.eventType}:`, err);
        }
      });
    }

    return payload;
  }

  /**
   * Get recent event history
   */
  public getHistory(): CranesEventPayload[] {
    return [...this.eventHistory];
  }
}

// Global Singleton Instance
export const eventDispatcher = new CranesEventDispatcher();
