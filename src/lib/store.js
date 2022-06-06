import { BehaviorSubject } from 'rxjs';

export const user = new BehaviorSubject(null);
export const pages = new BehaviorSubject(null);
export const blogs = new BehaviorSubject(null);
export const blog = new BehaviorSubject(null);
export const config = new BehaviorSubject(null);
export const disqusLoaded = new BehaviorSubject(false);
