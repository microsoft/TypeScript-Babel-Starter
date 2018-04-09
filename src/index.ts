export class C {
    private x = 10
    getX = () => this.x;
    setX = (newVal: number) => { this.x = newVal; }
}

export let x = new C();
export let y = { ...{ some: "value" } }
