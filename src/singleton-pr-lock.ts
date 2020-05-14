// Singleton lock object shared by bot, this is to prevent multiple PR's from running at the same time
export class SingletonPrLock {

    private static instance;

    private locked: boolean;
    private projects: Array<Record<string, number | string>>;

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
        .find(({ name, activePrNumber }) => name === projectName && activePrNumber === prNumber);

      if (!repositoryExists) {
        const project = {
          activePrName: prName,
          activePrNumber: prNumber,
          name: projectName,
        };

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

    public getPrNumber(projectName) {
        const currentProject: Record<string, any>  = this.projects.find(repository => repository.name === projectName);
        return currentProject[0].activePrNumber;
    }

    public getLockInfo(projectName) {
        const currentProject: Record<string, any>  = this.projects.find(repository => repository.name === projectName);
        if (!currentProject[0].activePrNumber) {
            throw new Error("Lock is not being held");
        }
        return "PR: `" + currentProject[0].activePrName + "` #" + currentProject[0].activePrNumber;
    }

    public unlock(projectName, prNumber) {
        const currentProject: Record<string, any>  = this.projects.find(repository => repository.name === projectName);
        if (currentProject[0].activePrNumber === prNumber) {
            const arrayIndex = this.projects.indexOf(currentProject);
            // remove the item from array using the index
            this.projects.slice(arrayIndex, 1);
            return true;
        }

        return false;
    }

    public isLocked(projectName) {
        const currentProject: Record<string, any>  = this.projects.find(repository => repository.name === projectName);
        if (currentProject[0].activePrNumber) {
            return this.locked;
        }

    }
}

export {SingletonPrLock as PrLock } from "./singleton-pr-lock";
