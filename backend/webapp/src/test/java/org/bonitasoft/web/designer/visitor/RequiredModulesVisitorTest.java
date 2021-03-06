/**
 * Copyright (C) 2015 Bonitasoft S.A.
 * Bonitasoft, 32 rue Gustave Eiffel - 38000 Grenoble
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2.0 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package org.bonitasoft.web.designer.visitor;

import static org.assertj.core.api.Assertions.assertThat;
import static org.bonitasoft.web.designer.builder.ComponentBuilder.aComponent;
import static org.bonitasoft.web.designer.builder.ContainerBuilder.aContainer;
import static org.bonitasoft.web.designer.builder.FormContainerBuilder.aFormContainer;
import static org.bonitasoft.web.designer.builder.PageBuilder.aPage;
import static org.bonitasoft.web.designer.builder.TabBuilder.aTab;
import static org.bonitasoft.web.designer.builder.TabsContainerBuilder.aTabsContainer;
import static org.bonitasoft.web.designer.builder.WidgetBuilder.aWidget;
import static org.mockito.Mockito.when;

import java.util.Set;
import java.util.UUID;

import org.bonitasoft.web.designer.builder.WidgetBuilder;
import org.bonitasoft.web.designer.model.page.Component;
import org.bonitasoft.web.designer.model.page.Page;
import org.bonitasoft.web.designer.model.widget.Widget;
import org.bonitasoft.web.designer.repository.WidgetRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class RequiredModulesVisitorTest {

    @Mock
    private WidgetRepository widgetRepository;
    @InjectMocks
    private RequiredModulesVisitor requiredModulesVisitor;

    @Test
    public void should_return_empty_set_when_no_extra_modules_are_needed() throws Exception {
        Component component = mockComponentFor(aWidget());
        Page page = aPage().with(component).build();

        Set<String> modules = requiredModulesVisitor.visit(page);

        assertThat(modules).isEmpty();
    }

    @Test
    public void should_return_list_of_module_needed_by_widgets() throws Exception {
        Component component = mockComponentFor(aWidget().modules("aModule", "anotherModule"));

        Set<String> modules = requiredModulesVisitor.visit(component);

        assertThat(modules).containsOnly("aModule", "anotherModule");
    }

    @Test
    public void should_return_list_of_module_needed_by_widgets_in_container() throws Exception {
        Component component1 = mockComponentFor(aWidget().modules("component1Module", "component1OtherModule"));
        Component component2 = mockComponentFor(aWidget().modules("component2Module", "component2OtherModule"));

        Set<String> modules = requiredModulesVisitor.visit(aContainer().with(component1, component2).build());

        assertThat(modules).containsOnly("component1Module", "component1OtherModule", "component2Module", "component2OtherModule");
    }

    @Test
    public void should_return_list_of_module_needed_by_widgets_in_formcontainer() throws Exception {
        Component component1 = mockComponentFor(aWidget().modules("component1Module", "component1OtherModule"));
        Component component2 = mockComponentFor(aWidget().modules("component2Module", "component2OtherModule"));

        Set<String> modules = requiredModulesVisitor.visit(aFormContainer().with(
                aContainer().with(component1, component2)).build());

        assertThat(modules).containsOnly("component1Module", "component1OtherModule", "component2Module", "component2OtherModule");
    }

    @Test
    public void should_return_list_of_module_needed_by_widgets_in_tabscontainer_plus_uibootstrap_which_is_needed_by_tabscontainer() throws Exception {
        Component component1 = mockComponentFor(aWidget().modules("component1Module", "component1OtherModule"));
        Component component2 = mockComponentFor(aWidget().modules("component2Module", "component2OtherModule"));

        Set<String> modules = requiredModulesVisitor.visit(aTabsContainer().with(
                aTab().with(aContainer().with(component1)),
                aTab().with(aContainer().with(component2))).build());

        assertThat(modules).containsOnly("component1Module", "component1OtherModule", "component2Module", "component2OtherModule", "ui.bootstrap");
    }

    @Test
    public void should_return_list_of_module_needed_by_widgets_in_previewable() throws Exception {
        Component component1 = mockComponentFor(aWidget().modules("component1Module", "component1OtherModule"));
        Component component2 = mockComponentFor(aWidget().modules("component2Module", "component2OtherModule"));

        Set<String> modules = requiredModulesVisitor.visit(aPage().with(component1, component2).build());

        assertThat(modules).containsOnly("component1Module", "component1OtherModule", "component2Module", "component2OtherModule");
    }

    private Component mockComponentFor(WidgetBuilder widgetBuilder) throws Exception {
        Widget widget = widgetBuilder.id(String.valueOf(UUID.randomUUID())).build();
        Component component = aComponent().withWidgetId(widget.getId()).build();
        when(widgetRepository.get(component.getId())).thenReturn(widget);
        return component;
    }
}
