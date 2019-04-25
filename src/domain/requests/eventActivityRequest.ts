export class EventActivityRequest {
    from: EventActivityFrom;
    name: string;
    type: string;
    value: string;
}

export class EventActivityFrom {
    id: string;
    name: string;
}