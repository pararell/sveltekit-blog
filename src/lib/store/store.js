import { BehaviorSubject } from 'rxjs';

export const loading = new BehaviorSubject(false);
export const user = new BehaviorSubject(null);
export const blogs = new BehaviorSubject(null);
export const blog = new BehaviorSubject(null);
export const config = new BehaviorSubject(null);
export const lang = new BehaviorSubject(null);
export const disqusLoaded = new BehaviorSubject(false);
