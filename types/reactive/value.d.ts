import type { ReactiveState, Subscriber, Unsubscriber } from '../models';
export declare function reactiveValue<Value>(value: Value): {
    callbacks: {
        get(): Value;
        peek(): Value;
        toJSON(): Value;
        toString(): string;
        run(): void;
        stop(): void;
        subscribe(subscriber: Subscriber<Value>): Unsubscriber;
        unsubscribe(subscriber: Subscriber<Value>): void;
    };
    state: ReactiveState<Value>;
};
