// Singleton lock object shared by bot, this is to prevent multiple PR's from running at the same time
export class SingletonPrLock {

    private static instance;

    private activePrName: string;
    private activePrNumber: number;
    private locked: boolean;
    private projects: Record<string, string | number>[];

    constructor() {
        if (typeof SingletonPrLock.instance === "object") {
            return SingletonPrLock.instance;
        }

        this.activePrName = "";
        this.activePrNumber = -1;
        this.locked = false;
        this.projects = [];


        SingletonPrLock.instance = this;
        return this;
    }

    public tryLock(prName, prNumber, projectName) {
      const repositoryExists = this.projects
        .find(({ name, pr }) => name === projectName && pr === prNumber);

      if (!repositoryExists) {
        this.activePrName = prName;
        this.activePrNumber = prNumber;


        const project = {
          name: projectName,
          pr: prNumber
        }

        this.projects.push(project);
        return true;
      }

      if (repositoryExists && this.activePrNumber === prNumber) {
        return true;
      }

      return false;

        // // if no one is holding the lock, obtain it
        // if (this.locked === false) {
        //     this.activePrName = prName;
        //     this.activePrNumber = prNumber;
        //     this.locked = true;
        //     return true;
        // }
        // // if a PR is attempting to lock and it already holds the lock, allow it to proceed
        // if (this.locked === true && this.activePrNumber === prNumber) {
        //     return true;
        // }
        // return false;
    }

    public getPrNumber() {
        return this.activePrNumber;
    }

    public getLockInfo() {
        if (this.locked === false) {
            throw new Error("Lock is not being held");
        }
        return "PR: `" + this.activePrName + "` #" + this.activePrNumber;
    }

    public unlock(prNumber) {
        if (this.activePrNumber === prNumber) {
            this.locked = false;
            return true;
        }
        return false;
    }

    public isLocked() {
        return this.locked;
    }
}

export {SingletonPrLock as PrLock } from "./singleton-pr-lock";
