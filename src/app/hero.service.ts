import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

// This marks the class as one that participates in the dependency injection system.
// https://angular.io/tutorial/toh-pt4#injectable-services
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  //  Handle Http operation that failed.
  // Let the app continue.
  //  @param operation - name of the operation that failed
  //  @param result - optional value to return as the observable result
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // You've swapped of() for http.get() and the app keeps working
  // without any other changes because both functions return an Observable<Hero[]>.
  // https://angular.io/tutorial/toh-pt6#get-heroes-with-httpclient

  // HttpClient.get() returns the body of the response as an untyped JSON object by default.
  // Applying the optional type specifier, <Hero[]> , adds TypeScript capabilities,
  // which reduce errors during compile time.
  // https://angular.io/tutorial/toh-pt6#httpclientget-returns-response-data
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      // They'll do that with the RxJS tap() operator, which looks at the observable values, does something
      // with those values, and passes them along. The tap() call back doesn't touch the values themselves.
      // https://angular.io/tutorial/toh-pt6#tap-into-the-observable
      tap((_) => this.log('fetched heroes')),
      //  The catchError() operator intercepts an Observable that failed.
      //  It passes the error an error handler that can do what it wants with the error.
      // The following handleError() method reports the error and then returns an
      // innocuous result so that the application keeps working.
      //  https://angular.io/tutorial/toh-pt6#error-handling
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heroes matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}
}
