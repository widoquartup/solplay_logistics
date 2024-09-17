import { emailTemplatesBasePath } from '@src/paths';
import fs from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';
import type { EmailContentType } from './EmailContentType';
class Templetize {

    public run(emailContent: EmailContentType): string {
        const preheader = join(emailTemplatesBasePath, 'preheader.hbs');
        const footer = join(emailTemplatesBasePath, 'footer.hbs');
        const action = join(emailTemplatesBasePath, 'action.hbs');
        const paragraph = join(emailTemplatesBasePath, 'paragraph.hbs');
        const codebox = join(emailTemplatesBasePath, 'codeBox.hbs');
        //eslint-disable-next-line
        Handlebars.registerPartial('footer', require(footer));
        //eslint-disable-next-line
        Handlebars.registerPartial('preheader', require(preheader));
        //eslint-disable-next-line
        Handlebars.registerPartial('action', require(action));
        //eslint-disable-next-line
        Handlebars.registerPartial('p', require(paragraph));
        //eslint-disable-next-line
        Handlebars.registerPartial('codebox', require(codebox));
        const template = join(emailTemplatesBasePath, 'template.hbs');
        const content = fs.readFileSync(template, 'utf8');
        const templateCompile = Handlebars.compile(content);
        return templateCompile(emailContent);
    }
}
export default Templetize;

