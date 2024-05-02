import { ServerRespond } from './DataStreamer';

export interface Row {
  ratio: number, // Add ratio field
  upper_bound: number, // Add upper_bound field
  lower_bound: number, // Add lower_bound field
  trigger_alert?: number, // Add trigger_alert field as optional
  price_abc: number, // Add price_abc field
  price_def: number, // Add price_def field
  timestamp: Date,
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    // Compute price_abc and price_def
    const priceABC = serverResponds[0].top_ask && serverResponds[0].top_ask.price || 0;
    const priceDEF = serverResponds[1].top_ask && serverResponds[1].top_ask.price || 0;

    // Calculate ratio
    const ratio = priceABC && priceDEF ? priceABC / priceDEF : 0;

    // Set upper and lower bounds
    const upperBound = 1.05; // Example value, you can change this
    const lowerBound = 0.95; // Example value, you can change this

    // Determine trigger_alert
    const triggerAlert = ratio > upperBound || ratio < lowerBound ? ratio : undefined;

    // Return a single Row object
    return {
      ratio,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: triggerAlert,
      price_abc: priceABC,
      price_def: priceDEF,
      timestamp: serverResponds[0].timestamp, // Use timestamp of stock ABC or stock DEF (both should be the same)
    };
  }
}

