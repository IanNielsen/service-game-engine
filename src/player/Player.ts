/**
 * Basic player class allowing us to encapsulate the player details
 */
export class Player {
  private balance: number;
  private playerId: string;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
    this.playerId = crypto.randomUUID();
  }

  getBalance(): number {
    return this.balance;
  }

  // in reality both this and the credit would be async calls to the player wallet
  debit(amount: number): void {
    if (this.balance - amount < 0) {
      throw new Error('Insufficient funds');
    }

    this.balance -= amount;
  }

  credit(amount: number): void {
    this.balance += amount;
  }

  getPlayerId(): string {
    return this.playerId;
  }
}