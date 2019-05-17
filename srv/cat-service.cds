using my.bookshop as my from '../db/data-model';

service CatalogService @(requires: 'authenticated-user') {
	entity Books @(restrict: [ 
					{ grant: ['READ','WRITE'], to: 'Administrator' },
					{ grant: 'READ', to: 'User'}
				]) 
		as projection on my.Books;
}