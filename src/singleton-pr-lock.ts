// Singleton lock object shared by bot, this is to prevent multiple PR's from running at the same time
export class SingletonPrLock {

    private static instance;

    private locked: boolean;
    private projects: Record<string, string | number>[];

    constructor() {
        if (typeof SingletonPrLock.instance === "object") {
            return SingletonPrLock.instance;
        }

        this.locked = false;
        this.projects = [];

        SingletonPrLock.instance = this;
        return this;
    }

    public tryLock(prName, prNumber, projectName) {
      const repositoryExists = this.projects
        .find(({ name, activePrNumber }) => 
          name === projectName && activePrNumber === prNumber
        );

      if (!repositoryExists) {
        const project = {
          name: projectName,
          activePrNumber: prNumber,
          activePrName: prName
        }

        this.projects.push(project);
        return true;
      }

      if (repositoryExists) {
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
